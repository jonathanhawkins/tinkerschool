import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion";
import { DemoContent } from "./demo-content";

export const metadata: Metadata = {
  title: "Try TinkerSchool - Free Interactive Demo",
  description:
    "Try real interactive lessons from TinkerSchool. No account needed! See how kids learn math, reading, science, and more with hands-on activities and an AI tutor.",
  openGraph: {
    title: "Try TinkerSchool - Free Interactive Demo",
    description:
      "Try real interactive lessons from TinkerSchool. No account needed!",
    type: "website",
  },
  alternates: {
    canonical: "https://tinkerschool.ai/demo",
  },
};

// ---------------------------------------------------------------------------
// Feature highlights for the page
// ---------------------------------------------------------------------------

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "10+ Activity Types",
    description: "Counting, matching, sorting, fill-in-the-blank, and more",
  },
  {
    icon: CheckCircle2,
    title: "Instant Feedback",
    description:
      "Chip celebrates every success and gently guides through mistakes",
  },
  {
    icon: Clock,
    title: "3 Minutes per Lesson",
    description: "Bite-sized learning designed for young attention spans",
  },
  {
    icon: Shield,
    title: "Safe and Private",
    description:
      "COPPA-compliant. No data collected. No account needed to try",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <div className="flex flex-1 items-center justify-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={28}
              height={28}
              className="size-7"
            />
            <span className="text-sm font-semibold text-foreground">
              TinkerSchool
            </span>
          </div>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/sign-up">Sign Up Free</Link>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-12 px-4 py-8">
        {/* Hero section */}
        <FadeIn>
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Chip mascot */}
            <Image
              src="/images/chip.png"
              alt="Chip, your AI learning buddy"
              width={80}
              height={80}
              className="drop-shadow-lg"
              priority
            />

            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/10 text-primary"
            >
              <Sparkles className="size-3" />
              Free Demo -- No Account Needed
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Try a Real TinkerSchool Lesson
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Pick a subject and play through a mini lesson. These are the same
              interactive activities that kids use in TinkerSchool -- just a
              small taste of what Chip can teach!
            </p>
          </div>
        </FadeIn>

        {/* Main demo area */}
        <FadeIn delay={0.1}>
          <Card className="rounded-2xl border-2 shadow-lg">
            <CardContent className="p-5 sm:p-6 md:p-8">
              <DemoContent />
            </CardContent>
          </Card>
        </FadeIn>

        {/* Feature highlights */}
        <FadeIn delay={0.15}>
          <div className="space-y-4">
            <h2 className="text-center text-lg font-semibold text-foreground">
              What Makes TinkerSchool Different
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((highlight) => (
                <Card
                  key={highlight.title}
                  className="rounded-2xl border shadow-sm"
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <highlight.icon className="size-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold text-foreground">
                        {highlight.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {highlight.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Bottom CTA */}
        <FadeIn delay={0.2}>
          <Card className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-[#EA580C]">
            <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Ready for the Full Experience?
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/80">
                100+ interactive lessons across 7 subjects. A personal AI tutor
                that adapts to your child. Progress tracking for parents. All
                free and open source.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full bg-white px-8 font-semibold text-primary shadow-lg hover:bg-white/90"
                >
                  <Link href="/sign-up">
                    Create Free Account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/#subjects">Explore All Subjects</Link>
                </Button>
              </div>
              <p className="text-xs text-white/60">
                No credit card required. Always free. Always open source.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border bg-muted/20 px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-sm font-medium text-foreground">
              TinkerSchool.ai
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Free and open source education for every child.
          </p>
        </div>
      </footer>
    </div>
  );
}
