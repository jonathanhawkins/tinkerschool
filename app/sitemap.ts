import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog/posts";

// Keep these dates in sync with actual content changes.
// Format: YYYY-MM-DD
const SITE_LAUNCH_DATE = new Date("2026-02-22");
const TERMS_LAST_UPDATED = new Date("2026-02-17");
const PRIVACY_LAST_UPDATED = new Date("2026-02-22");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tinkerschool.ai";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: PRIVACY_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: TERMS_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
