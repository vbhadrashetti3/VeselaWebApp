import { getBlogPosts } from "@/services/hubspot/blogApi";
import BlogListingClient from "./BlogListingClient";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const page = params?.page || "1";
  const category = params?.category;
  
  const title = category && category !== "All"
    ? `${category} Articles - Vesela Blog`
    : page !== "1"
    ? `Blog - Page ${page} - Vesela`
    : "Vesela Blog | Insights, Ideas and Resources";

  const description =
    "Discover the latest insights, artificial intelligence research, product updates, and thought leadership from the Vesela & Gray Sky AI team.";

  return {
    title,
    description,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Vesela",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Vesela Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@Vesela_AI",
    },
  };
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || 1, 10);
  const search = params?.search || "";
  const category = params?.category || "All";

  let initialData = null;
  let initialError = null;

  try {
    initialData = await getBlogPosts({ page, limit: 6, search, category });
  } catch (err) {
    console.error("BlogPage Server Fetch Error:", err);
    initialError = err.message || "Failed to load blog posts";
  }

  return (
    <BlogListingClient
      initialData={initialData}
      initialError={initialError}
      initialPage={page}
      initialSearch={search}
      initialCategory={category}
    />
  );
}
