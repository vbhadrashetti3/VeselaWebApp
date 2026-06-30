import { NextResponse } from "next/server";

const BASE_URL = "https://portal.grayskyai.com";

// Headers the browser sends that must be forwarded to the backend
const FORWARDED_REQUEST_HEADERS = ["content-type", "accept", "accept-language"];

// Extract a specific cookie value from a Cookie header string
function parseCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Common handler ───────────────────────────────────────────────────────────
async function handleRequest(req, context, method) {
  try {
    // Next 15+: params is async
    const resolvedParams = await context.params;
    const path = resolvedParams.path.join("/");

    // Preserve query params
    const search = req.nextUrl.search;

    // Force trailing slash (Django backend requirement)
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
    });

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
    console.error("❌ Proxy Error:", error);

    return NextResponse.json(
      {
        error: "Proxy failed",
        message: error.message,
      },
      { status: 500 },
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
