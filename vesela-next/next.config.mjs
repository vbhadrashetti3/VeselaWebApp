import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const blogSlugPrefix =
  process.env.HUBSPOT_BLOG_SLUG_PREFIX?.replace(/^\/+|\/+$/g, "") ||
  "gray-sky-ai-blog";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: appRoot,
  },
  transpilePackages: ["@fishaudio/agent-client", "livekit-client"],
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
