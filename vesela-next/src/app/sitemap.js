import { SITE_URL } from "@/lib/siteConfig";
import { getAllBlogPostsForSitemap } from "@/services/hubspot/blogApi";

export default async function sitemap() {
  const staticPages = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let blogEntries = [];
  try {
    const posts = await getAllBlogPostsForSitemap();
    blogEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishDate ? new Date(post.publishDate) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("sitemap: failed to fetch blog posts", error);
  }

  return [...staticPages, ...blogEntries];
}
