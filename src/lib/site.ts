// Switch NEXT_PUBLIC_SITE_URL to https://drmsa.org once DNS points at Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://drm-website.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "DRM SA Group";

export const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
