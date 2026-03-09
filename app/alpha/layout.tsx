import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha Program — TinkerSchool",
  description:
    "Join the TinkerSchool alpha program. We're looking for 5 families with kids in K-2nd grade to test our AI-powered learning platform with Chip, a friendly AI tutor.",
  openGraph: {
    title: "Alpha Program — TinkerSchool",
    description:
      "Join the TinkerSchool alpha program. We're looking for 5 families with kids in K-2nd grade to test our AI-powered learning platform.",
    type: "website",
    url: "https://tinkerschool.ai/alpha",
    siteName: "TinkerSchool",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AlphaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
