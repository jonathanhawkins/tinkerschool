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
  keywords: [
    "AI tutor for kids",
    "homeschool curriculum",
    "STEM activities for kids",
    "hands-on learning",
    "coding for kids",
    "K-6 education platform",
    "free education platform",
    "personalized learning",
    "afterschooling",
    "kids learning app",
  ],
  authors: [{ name: "TinkerSchool", url: "https://tinkerschool.ai" }],
  creator: "TinkerSchool",
  publisher: "TinkerSchool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "TinkerSchool",
    title: "TinkerSchool - Learn Everything with Chip!",
    description:
      "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids.",
    locale: "en_US",
    url: "https://tinkerschool.ai",
    images: [
      {
        url: "https://tinkerschool.ai/opengraph-image",
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
        url: "https://tinkerschool.ai/twitter-image",
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
    shortcut: "/favicon.ico",
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
    "msapplication-config": "/browserconfig.xml",
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
                    "@id": "https://tinkerschool.ai/#organization",
                    name: "TinkerSchool",
                    url: "https://tinkerschool.ai",
                    logo: {
                      "@type": "ImageObject",
                      "@id": "https://tinkerschool.ai/#logo",
                      url: "https://tinkerschool.ai/icon-512.png",
                      width: 512,
                      height: 512,
                      caption: "TinkerSchool",
                    },
                    image: {
                      "@id": "https://tinkerschool.ai/#logo",
                    },
                    description:
                      "Open-source AI-powered education platform for K-6 kids. Learn math, reading, science, music, art, problem solving, and coding with your AI buddy Chip.",
                    email: "hello@tinkerschool.ai",
                    foundingDate: "2026",
                    sameAs: [
                      "https://github.com/jonathanhawkins/tinkerschool",
                    ],
                    contactPoint: {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      email: "hello@tinkerschool.ai",
                      availableLanguage: "English",
                    },
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://tinkerschool.ai/#website",
                    name: "TinkerSchool",
                    url: "https://tinkerschool.ai",
                    description:
                      "Open-source AI-powered education platform for K-6 kids. Learn math, reading, science, music, art, problem solving, and coding with your AI buddy Chip.",
                    publisher: {
                      "@id": "https://tinkerschool.ai/#organization",
                    },
                    inLanguage: "en-US",
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
                    "@id": "https://tinkerschool.ai/#app",
                    name: "TinkerSchool",
                    url: "https://tinkerschool.ai",
                    applicationCategory: "EducationalApplication",
                    applicationSubCategory: "K-12 Education",
                    operatingSystem: "Web Browser",
                    browserRequirements: "Requires Chrome 89+ or Edge 89+",
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
                    creator: {
                      "@id": "https://tinkerschool.ai/#organization",
                    },
                    featureList: [
                      "AI-powered personalized tutoring",
                      "Math, Reading, Science, Music, Art, Problem Solving, Coding",
                      "M5StickC Plus 2 hardware integration",
                      "COPPA-compliant child safety",
                      "Parent dashboard with progress monitoring",
                      "Offline-capable with browser simulator",
                    ],
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
