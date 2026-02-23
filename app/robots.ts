import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/demo", "/blog", "/privacy", "/terms", "/support", "/feed.xml", "/sitemap.xml"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/onboarding/",
          "/sign-in/",
          "/sign-up/",
          "/home",
          "/home/",
          "/workshop/",
          "/workshop",
          "/lessons/",
          "/subjects/",
          "/achievements/",
          "/gallery/",
          "/chat/",
          "/settings/",
          "/setup/",
          "/coppa-confirmed",
          "/coppa-confirmed/",
          "/debug/",
        ],
      },
    ],
    sitemap: "https://tinkerschool.ai/sitemap.xml",
    host: "https://tinkerschool.ai",
  };
}
