import { getBlogPostBySlug, getRelatedPosts } from "@/services/hubspot/blogApi";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

    if (!slugPath) {
      return NextResponse.json(
        { success: false, message: "Article slug is required." },
        { status: 400 }
      );
    }

    const post = await getBlogPostBySlug(slugPath);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Article not found." },
        { status: 404 }
      );
    }

    const relatedPosts = await getRelatedPosts(post.id, post.tags, 3);

    return NextResponse.json({
      success: true,
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error(`API /api/blog GET error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article details. Please try again later.",
      },
      { status: 500 }
    );
  }
}
