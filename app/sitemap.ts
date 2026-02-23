import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tinkerschool.ai";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-02-22",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: "2026-02-22",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: "2026-02-22",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-02-22",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2026-02-22",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: "2026-02-22",
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
