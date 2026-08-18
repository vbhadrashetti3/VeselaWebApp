/** @type {import('next').NextConfig} */
const blogSlugPrefix =
  process.env.HUBSPOT_BLOG_SLUG_PREFIX?.replace(/^\/+|\/+$/g, "") ||
  "gray-sky-ai-blog";

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: `/blog/${blogSlugPrefix}/:slug*`,
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
