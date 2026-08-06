/**
 * Dynamically determines the current brand (defaults to "vesela" for this application).
 * 
 * @returns {"vesela" | "graysky" | "grayskyai"}
 */
export const getCurrentBrand = () => {
  if (process.env.NEXT_PUBLIC_BRAND) {
    return process.env.NEXT_PUBLIC_BRAND.toLowerCase();
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    if (host.includes("grayskyai")) return "grayskyai";
    if (host.includes("graysky")) return "graysky";
    if (host.includes("vesela")) return "vesela";
  }

  return "vesela";
};
