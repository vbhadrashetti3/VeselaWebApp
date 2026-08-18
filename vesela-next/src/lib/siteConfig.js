/** Canonical production URL — override with NEXT_PUBLIC_SITE_URL when needed. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://vesela.ai";
