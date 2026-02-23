import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { LandingContent } from "./landing-content";

export const metadata: Metadata = {
  title:
    "TinkerSchool - AI-Powered Learning Platform for Kids Ages 5-12",
  description:
    "Free, open-source AI tutor for K-6 kids. Hands-on STEM activities, personalized lessons in math, reading, science, music, art, coding and more. Perfect for homeschooling, afterschooling, and supplemental learning.",
  keywords: [
    "AI tutor for kids",
    "homeschool curriculum",
    "afterschooling",
    "STEM activities for kids",
    "hands-on learning",
    "coding for kids",
    "supplemental education",
    "K-6 learning platform",
    "free education platform",
    "personalized learning",
  ],
  openGraph: {
    title: "TinkerSchool - AI-Powered Learning Platform for Kids Ages 5-12",
    description:
      "Free, open-source AI tutor for K-6 kids. Hands-on STEM activities, personalized lessons in math, reading, science, music, art, coding and more.",
    type: "website",
    url: "https://tinkerschool.ai",
    siteName: "TinkerSchool",
    locale: "en_US",
    images: [
      {
        url: "https://tinkerschool.ai/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TinkerSchool - AI-Powered Learning Platform for Kids Ages 5-12",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TinkerSchool - AI-Powered Learning Platform for Kids Ages 5-12",
    description:
      "Free, open-source AI tutor for K-6 kids. Hands-on STEM activities and personalized lessons for homeschooling and afterschooling.",
    images: [
      {
        url: "https://tinkerschool.ai/twitter-image",
        width: 1200,
        height: 630,
        alt: "TinkerSchool - AI-Powered Learning Platform for Kids Ages 5-12",
      },
    ],
  },
  alternates: {
    canonical: "https://tinkerschool.ai",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is TinkerSchool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TinkerSchool is an open-source, AI-powered education platform for kids ages 5\u201312. It covers math, reading, science, music, art, problem solving, and coding through hands-on projects with real hardware and a personal AI tutor named Chip.",
      },
    },
    {
      "@type": "Question",
      name: "Is TinkerSchool really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free and open source. Supporters help fund AI tutoring costs, but every lesson and feature is available to all families at no charge.",
      },
    },
    {
      "@type": "Question",
      name: "What ages is TinkerSchool designed for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TinkerSchool is designed for grades K\u20136 (ages 5\u201312) with five progressive curriculum bands: Explorer (K\u20131), Builder (2\u20133), Inventor (3\u20134), Hacker (4\u20135), and Creator (5\u20136). Each band adapts content and difficulty to the child\u2019s level.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI tutor Chip work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Chip is a personal AI learning buddy powered by Claude. Chip guides kids through leading questions, never gives away answers, and adapts to each child\u2019s learning style and interests. All conversations are logged so parents can review them anytime.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to buy the M5StickC hardware?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! TinkerSchool works with a built-in simulator for trying lessons on any device. The M5StickC Plus 2 (~$29) adds hands-on hardware projects but isn\u2019t required to get started.",
      },
    },
    {
      "@type": "Question",
      name: "Is TinkerSchool safe for children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, fully COPPA-compliant. Kids use PIN-based login (no email required), all data is family-scoped, AI conversations are logged for parent review, and content has strict safety guardrails.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use TinkerSchool for homeschooling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! TinkerSchool covers all core subjects with personalized AI tutoring. Many families use it as a primary homeschool curriculum or as supplemental afterschooling.",
      },
    },
    {
      "@type": "Question",
      name: "How is TinkerSchool different from other learning apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TinkerSchool combines an AI tutor, real hardware projects, and all school subjects in one platform. Kids build real things \u2014 not just watch videos or answer multiple-choice questions.",
      },
    },
  ],
};

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <LandingContent />
    </>
  );
}
