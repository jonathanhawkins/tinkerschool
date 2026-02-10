import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion";
import { DemoLesson } from "./demo-lesson";

export const metadata: Metadata = {
  title: "Try TinkerSchool - Free Demo",
  description:
    "Try an interactive lesson from TinkerSchool. No account needed! See how kids learn math, reading, science, and more.",
};

// ---------------------------------------------------------------------------
// Sample activity config for the demo (a mini math lesson)
// ---------------------------------------------------------------------------

const DEMO_CONFIG = {
  activities: [
    {
      type: "multiple_choice" as const,
      questions: [
        {
          id: "demo-mc-1",
          prompt: "What is 3 + 2?",
          promptEmoji: "🧮",
          options: [
            { id: "a", text: "4", emoji: "4️⃣" },
            { id: "b", text: "5", emoji: "5️⃣" },
            { id: "c", text: "6", emoji: "6️⃣" },
          ],
          correctOptionId: "b",
          hint: "Count on your fingers: start at 3 and count 2 more!",
        },
        {
          id: "demo-mc-2",
          prompt: "Which shape has 3 sides?",
          promptEmoji: "📐",
          options: [
            { id: "a", text: "Circle", emoji: "⭕" },
            { id: "b", text: "Square", emoji: "⬜" },
            { id: "c", text: "Triangle", emoji: "🔺" },
          ],
          correctOptionId: "c",
          hint: "Tri means three!",
        },
      ],
      shuffleOptions: true,
    },
    {
      type: "counting" as const,
      questions: [
        {
          id: "demo-count-1",
          prompt: "How many stars do you see?",
          emoji: "⭐",
          correctCount: 4,
          displayCount: 4,
          hint: "Point to each star and count out loud!",
        },
      ],
    },
    {
      type: "sequence_order" as const,
      questions: [
        {
          id: "demo-seq-1",
          prompt: "Put these numbers in order from smallest to biggest!",
          items: [
            { id: "s1", text: "3", emoji: "3️⃣", correctPosition: 2 },
            { id: "s2", text: "1", emoji: "1️⃣", correctPosition: 1 },
            { id: "s3", text: "5", emoji: "5️⃣", correctPosition: 3 },
          ],
          hint: "Which number is the smallest? That goes first!",
        },
      ],
    },
  ],
  passingScore: 50,
  estimatedMinutes: 3,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple nav */}
      <nav className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back
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
              TinkerSchool Demo
            </span>
          </div>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/sign-up">Sign Up Free</Link>
          </Button>
        </div>
      </nav>

      {/* Demo content */}
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <FadeIn>
          <div className="space-y-2 text-center">
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 bg-primary/10 text-primary"
            >
              <Sparkles className="size-3" />
              Free Demo - No Account Needed
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Try a Mini Math Lesson!
            </h1>
            <p className="text-sm text-muted-foreground">
              See how TinkerSchool makes learning fun with interactive
              activities. This is a short demo -- full lessons have even more!
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card
            className="overflow-hidden rounded-2xl border-2"
            style={{ borderColor: "#3B82F640" }}
          >
            <CardContent className="p-5 sm:p-6">
              <DemoLesson config={DEMO_CONFIG} />
            </CardContent>
          </Card>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Want the full experience with 100+ lessons across 7 subjects?
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/sign-up">
                  <Sparkles className="size-4" />
                  Start Learning Free
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
