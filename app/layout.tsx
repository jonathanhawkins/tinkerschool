import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import ChipVoiceGlobal from "@/components/chip-voice-global";
import { CoppaAnalytics } from "@/components/coppa-analytics";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TinkerSchool - Learn Everything with Chip!",
    template: "%s | TinkerSchool",
  },
  description:
    "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids. Learn math, reading, science, music, art, problem solving, and coding with your AI buddy Chip.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://tinkerschool.ai"
  ),
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F97316" },
    { media: "(prefers-color-scheme: dark)", color: "#F97316" },
  ],
  openGraph: {
    type: "website",
    siteName: "TinkerSchool",
    title: "TinkerSchool - Learn Everything with Chip!",
    description:
      "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids.",
    locale: "en_US",
    images: [
      {
        url: "https://tinkerschool.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "TinkerSchool - Where every kid is a genius waiting to bloom",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tinkerschool",
    creator: "@tinkerschool",
    title: "TinkerSchool - Learn Everything with Chip!",
    description:
      "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids.",
    images: [
      {
        url: "https://tinkerschool.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "TinkerSchool - Where every kid is a genius waiting to bloom",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://tinkerschool.ai",
    types: {
      "application/rss+xml": "https://tinkerschool.ai/feed.xml",
    },
  },
  other: {
    "msapplication-TileColor": "#F97316",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    name: "TinkerSchool",
                    url: "https://tinkerschool.ai",
                    logo: "https://tinkerschool.ai/images/chip.png",
                    description:
                      "Open-source AI-powered education platform for K-6 kids. Learn math, reading, science, music, art, problem solving, and coding with your AI buddy Chip.",
                    sameAs: [
                      "https://github.com/jonathanhawkins/tinkerschool",
                    ],
                  },
                  {
                    "@type": "WebSite",
                    name: "TinkerSchool",
                    url: "https://tinkerschool.ai",
                    description:
                      "Open-source AI-powered education platform for K-6 kids. Learn math, reading, science, music, art, problem solving, and coding with your AI buddy Chip.",
                    potentialAction: {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                          "https://tinkerschool.ai/blog?q={search_term_string}",
                      },
                      "query-input": "required name=search_term_string",
                    },
                  },
                  {
                    "@type": "SoftwareApplication",
                    name: "TinkerSchool",
                    applicationCategory: "EducationalApplication",
                    operatingSystem: "Web",
                    offers: {
                      "@type": "Offer",
                      price: "0",
                      priceCurrency: "USD",
                    },
                    description:
                      "AI-powered education platform where kids ages 5-12 learn all subjects through hands-on projects with real hardware and a personal AI tutor named Chip.",
                    audience: {
                      "@type": "EducationalAudience",
                      educationalRole: "student",
                      typicalAgeRange: "5-12",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
        <body
          className={`${nunito.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {children}
          <ChipVoiceGlobal />
          {/* COPPA: Analytics only load on public/marketing and parent pages,
              never on kid-facing authenticated pages. See coppa-analytics.tsx. */}
          <CoppaAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
