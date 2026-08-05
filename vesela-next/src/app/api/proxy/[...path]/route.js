import { NextResponse } from "next/server";

const BASE_URL = "https://portal.grayskyai.com";

// How long (ms) to wait for the upstream backend before giving up.
// Kept below the default Next.js serverless function limit (25s) but short
// enough that auth checks don't block the user for a long time on a slow network.
const UPSTREAM_TIMEOUT_MS = 8000;

// Headers the browser sends that must be forwarded to the backend
const FORWARDED_REQUEST_HEADERS = ["content-type", "accept", "accept-language"];

// Extract a specific cookie value from a Cookie header string
function parseCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Returns true when the error is a network-level connection/timeout failure
// (Node.js undici errors from fetch, or AbortController cancellation).
function isNetworkError(err) {
  if (err?.name === "AbortError") return true;
  const code = err?.cause?.code ?? err?.code ?? "";
  return (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_SOCKET" ||
    code === "UND_ERR_ABORTED" ||
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT"
  );
}

// ─── Common handler ───────────────────────────────────────────────────────────
async function handleRequest(req, context, method) {
  // AbortController lets us cancel the upstream fetch after UPSTREAM_TIMEOUT_MS.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    // Next 15+: params is async
    const resolvedParams = await context.params;
    const path = resolvedParams.path.filter(Boolean).join("/");

    // Preserve query params
    const search = req.nextUrl.search;

    // Force single trailing slash (Django backend requirement)
    const url = `${BASE_URL}/${path}/${search}`;

    console.log(`➡️ Proxying ${method}: ${url}`);

    // ── Build forwarded headers ───────────────────────────────────────────────

    const forwardedHeaders = {};

    // Forward safe request headers
    for (const name of FORWARDED_REQUEST_HEADERS) {
      const value = req.headers.get(name);
      if (value) forwardedHeaders[name] = value;
    }

    // Forward cookies from the browser to the backend
    const incomingCookies = req.headers.get("cookie") || "";
    if (incomingCookies) {
      forwardedHeaders["cookie"] = incomingCookies;
    }

    // CSRF: attach X-CSRFToken for state-mutating requests so Django accepts them
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      const csrfToken = parseCookieValue(incomingCookies, "csrftoken");
      if (csrfToken) {
        forwardedHeaders["x-csrftoken"] = csrfToken;
      }
    }

    // ── Get body ─────────────────────────────────────────────────────────────

    let body = undefined;
    if (method !== "GET" && method !== "DELETE") {
      body = await req.text();
    }

    // ── Upstream fetch ────────────────────────────────────────────────────────

    const response = await fetch(url, {
      method,
      headers: forwardedHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.text();

    // ── Build the Next.js response ────────────────────────────────────────────

    const nextResponse = new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Forward every Set-Cookie header from the backend back to the browser so
    // auth cookies (my-app-auth, my-refresh-token, csrftoken, sessionid) are
    // stored on the Next.js domain and sent automatically on future requests.
    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      nextResponse.headers.append("Set-Cookie", cookie);
    }

    return nextResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    const networkFailure = isNetworkError(error);

    // Log the full error server-side for observability, but never leak
    // internal details (stack traces, host names) to the browser client.
    if (networkFailure) {
      console.warn(
        `⚠️ Proxy: upstream unreachable (${method} ${req.nextUrl.pathname}):`,
        error?.cause?.code ?? error?.code ?? error?.name,
      );
    } else {
      console.error(`❌ Proxy Error (${method} ${req.nextUrl.pathname}):`, error);
    }

    // 503 = backend is down/unreachable — callers should treat as a transient
    //       failure and NOT clear auth state (network may be briefly unavailable).
    // 500 = unexpected proxy-level error.
    const status = networkFailure ? 503 : 500;
    const clientMessage = networkFailure
      ? "The service is temporarily unavailable. Please try again."
      : "An unexpected error occurred. Please try again.";

    return NextResponse.json(
      { error: networkFailure ? "upstream_unavailable" : "proxy_error", message: clientMessage },
      { status },
    );
  }
}

// ─── Export HTTP methods ──────────────────────────────────────────────────────
export async function GET(req, context) {
  return handleRequest(req, context, "GET");
}

export async function POST(req, context) {
  return handleRequest(req, context, "POST");
}

export async function PUT(req, context) {
  return handleRequest(req, context, "PUT");
}

export async function PATCH(req, context) {
  return handleRequest(req, context, "PATCH");
}

export async function DELETE(req, context) {
  return handleRequest(req, context, "DELETE");
}
