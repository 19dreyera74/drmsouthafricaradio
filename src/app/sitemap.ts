import type { MetadataRoute } from "next";
import { newsArticles } from "@/lib/content";
import { absolute } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absolute("/news"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absolute("/news/local"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absolute("/news/global"), lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: absolute("/what-is-drm"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/membership"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/about-us"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absolute("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
  // Global items canonicalise to drm.org, so only our own articles go in the sitemap.
  const local = newsArticles.map((a) => ({
    url: absolute(`/news/local/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...pages, ...local];
}
