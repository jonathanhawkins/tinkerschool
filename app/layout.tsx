import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ChipVoiceGlobal from "@/components/chip-voice-global";
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
  openGraph: {
    type: "website",
    siteName: "TinkerSchool",
    title: "TinkerSchool - Learn Everything with Chip!",
    description:
      "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinkerSchool - Learn Everything with Chip!",
    description:
      "Where every kid is a genius waiting to bloom. An open-source AI-powered education platform for K-6 kids.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#F97316",
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
        <body
          className={`${nunito.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {children}
          <ChipVoiceGlobal />
          <Analytics />
          <SpeedInsights />
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "5d17afae58b64c0798cc717bae46bbb1"}'
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
