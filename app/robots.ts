import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/onboarding/", "/sign-in/", "/sign-up/"],
      },
    ],
    sitemap: "https://tinkerschool.ai/sitemap.xml",
  };
}
