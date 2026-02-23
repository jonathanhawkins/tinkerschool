import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  Bot,
  Github,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Support TinkerSchool - Help Fund Free Education for Every Kid",
  description:
    "TinkerSchool is free and open source. Your support helps fund AI tutoring costs so every child can access personalized learning in math, reading, science, coding, and more.",
  keywords: [
    "support open source education",
    "fund AI tutoring for kids",
    "donate to education platform",
    "free learning for kids",
    "support homeschool platform",
  ],
  openGraph: {
    title: "Support TinkerSchool - Help Fund Free Education for Every Kid",
    description:
      "Your support helps fund AI tutoring costs so every child ages 5-12 can access personalized, hands-on learning. Always free, always open source.",
    type: "website",
    url: "https://tinkerschool.ai/support",
    siteName: "TinkerSchool",
    locale: "en_US",
    images: [
      {
        url: "https://tinkerschool.ai/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Support TinkerSchool - Free Education for Every Kid",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support TinkerSchool - Help Fund Free Education for Every Kid",
    description:
      "Your support helps fund AI tutoring costs so every child ages 5-12 can access personalized, hands-on learning.",
  },
  alternates: {
    canonical: "https://tinkerschool.ai/support",
  },
};

const reasons = [
  {
    icon: Bot,
    title: "AI That Costs Real Money",
    description:
      "Chip runs on Claude, which costs $3-9/month per active child. Until we can fine-tune a custom model, every conversation has a real cost.",
  },
  {
    icon: Github,
    title: "Always Free & Open Source",
    description:
      "Every lesson, tool, and line of code is open for parents and educators to use, remix, and improve. That will never change.",
  },
  {
    icon: Heart,
    title: "Fund the Mission",
    description:
      "Your support directly funds AI costs, server infrastructure, and new curriculum development. Think Wikipedia, not SaaS.",
  },
];

const benefits = [
  "Premium AI tutoring with Claude Sonnet",
  "Supporter badge on your family profile",
  "Help fund free education for all kids",
  "Priority access to new features",
];

const supportStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://tinkerschool.ai",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Support TinkerSchool",
      item: "https://tinkerschool.ai/support",
    },
  ],
};

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(supportStructuredData),
        }}
      />
      {/* Nav */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={32}
              height={32}
              className="rounded-xl"
            />
            <span className="text-lg font-bold text-foreground">
              TinkerSchool
            </span>
          </Link>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-950/30">
          <Heart className="size-8 text-pink-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Support TinkerSchool
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          TinkerSchool is free. Every kid deserves access to great education,
          regardless of what their family can afford. Supporters help make that
          possible.
        </p>
      </section>

      {/* Why support */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <h2 className="sr-only">Why Support TinkerSchool</h2>
        <div className="grid gap-6 md:grid-cols-3">
        {reasons.map((reason) => (
          <Card key={reason.title} className="rounded-2xl">
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <reason.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </CardContent>
          </Card>
        ))}
        </div>
      </section>

      {/* Pricing summary */}
      <section className="bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-2xl font-bold">Supporter Plan</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            $5/month or $49/year (save 18%)
          </p>

          <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/dashboard/billing"
                className="text-primary underline underline-offset-2"
              >
                Go to billing
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={20}
              height={20}
              className="rounded-md"
            />
            <span className="text-sm text-muted-foreground">
              TinkerSchool.ai
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/demo" className="transition-colors hover:text-foreground">
              Try Demo
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Free and open source, always.
          </p>
        </div>
      </footer>
    </div>
  );
}
