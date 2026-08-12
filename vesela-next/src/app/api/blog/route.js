import { getBlogPosts } from "@/services/hubspot/blogApi";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 6;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";

    const result = await getBlogPosts({ page, limit, search, category, tag });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("API /api/blog GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog posts. Please try again later.",
      },
      { status: 500 }
    );
  }
}
