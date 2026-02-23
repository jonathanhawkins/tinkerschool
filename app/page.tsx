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
  alternates: {
    canonical: "https://tinkerschool.ai",
  },
};

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return <LandingContent />;
}
