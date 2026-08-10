import { getBlogPostBySlug, getRelatedPosts } from "@/services/hubspot/blogApi";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Article slug is required." },
        { status: 400 }
      );
    }

    const post = await getBlogPostBySlug(slug);

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
    console.error(`API /api/blog/${params?.slug} GET error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article details. Please try again later.",
      },
      { status: 500 }
    );
  }
}
