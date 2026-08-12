import { getBlogPostBySlug, getRelatedPosts } from "@/services/hubspot/blogApi";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

function getSlugFromParams(paramsSlug) {
  if (Array.isArray(paramsSlug)) {
    return paramsSlug.join("/");
  }
  return paramsSlug || "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = getSlugFromParams(slug);
  const post = await getBlogPostBySlug(slugPath);

  if (!post) {
    return {
      title: "Article Not Found - Vesela Blog",
      description: "The requested blog article could not be found.",
    };
  }

  return {
    title: `${post.title} | Vesela Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.authorName],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.featuredImage],
      site: "@Vesela_AI",
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const slugPath = getSlugFromParams(slug);
  const post = await getBlogPostBySlug(slugPath);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.tags, 3);

  // JSON-LD Structured Data for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: [post.featuredImage],
    datePublished: post.publishDate,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Gray Sky AI",
      logo: {
        "@type": "ImageObject",
        url: "https://vesela.ai/favicon.webp",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
