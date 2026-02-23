import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/onboarding/",
          "/sign-in/",
          "/sign-up/",
          "/home",
          "/workshop/",
          "/lessons/",
          "/subjects/",
          "/achievements/",
          "/gallery/",
          "/chat/",
          "/settings/",
          "/setup/",
          "/coppa-confirmed",
        ],
      },
    ],
    sitemap: "https://tinkerschool.ai/sitemap.xml",
  };
}
