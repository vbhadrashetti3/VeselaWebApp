import { NextResponse } from "next/server";

const BASE_URL = "https://portal.grayskyai.com";

// 🔹 Common handler
async function handleRequest(req, context, method) {
  try {
    // ✅ FIX: params is async in Next 15+
    const resolvedParams = await context.params;
    const path = resolvedParams.path.join("/");

    // ✅ Preserve query params
    const search = req.nextUrl.search;

    // ✅ FORCE trailing slash (important for Django backend)
    const url = `${BASE_URL}/${path}/${search}`;

    console.log(`➡️ Proxying ${method}: ${url}`);

    // ✅ Get body only for required methods
    let body = undefined;
    if (method !== "GET" && method !== "DELETE") {
      body = await req.text();
    }

    // ✅ Forward request to backend
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

// 🔹 Export methods
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
