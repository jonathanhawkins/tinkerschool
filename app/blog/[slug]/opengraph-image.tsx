import { ImageResponse } from "next/og";

import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Note: Next.js uses this as the static fallback alt. Dynamic alt is set per-post
// in generateMetadata (app/blog/[slug]/page.tsx) via twitter.images[].alt.
export const alt = "TinkerSchool Blog";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Blog Post";
  const description = post?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          padding: "80px",
          backgroundColor: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(to right, #F97316, #EA580C)",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#F97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            T
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1C1917",
            }}
          >
            TinkerSchool Blog
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "42px" : "52px",
            fontWeight: 700,
            color: "#1C1917",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: "24px",
              color: "#64748B",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {description.length > 120
              ? `${description.slice(0, 120)}...`
              : description}
          </div>
        )}

        {/* Bottom: domain */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: "20px",
            color: "#94A3B8",
          }}
        >
          tinkerschool.ai
        </div>
      </div>
    ),
    { ...size },
  );
}
