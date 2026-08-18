import { SITE_URL } from "@/lib/siteConfig";

/**
 * Crawler-only rules. robots.txt never blocks browsers, fetch(), or mobile apps.
 * Backend APIs (e.g. portal.grayskyai.com) live on other domains and are unaffected.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/chat",
        "/welcome",
        "/change-password",
        "/share/",
        "/home",
        "/_next/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
