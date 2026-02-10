import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Blocks,
  HelpCircle,
  Lightbulb,
  MonitorPlay,
  Target,
  Usb,
  Wrench,
  Zap,
  MessageCircle,
} from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help - Getting Started",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome to TinkerSchool!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s everything you need to get started learning with Chip.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Meet Chip */}
      <FadeIn delay={0.05}>
        <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" />
              <CardTitle className="text-base">Meet Chip</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Image
                src="/images/chip.png"
                alt="Chip"
                width={48}
                height={48}
                className="shrink-0 rounded-xl"
              />
              <div className="space-y-2 text-sm leading-relaxed text-foreground/80">
                <p>
                  Hi! I&apos;m <strong>Chip</strong>, your learning buddy! I&apos;m
                  here to help you learn math, reading, science, music, art, and
                  coding -- all with the help of your M5Stick device.
                </p>
                <p>
                  I won&apos;t just give you answers. Instead, I&apos;ll ask you
                  questions and give you hints so YOU can figure things out. That&apos;s
                  how real learning works!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* How lessons work */}
      <FadeIn delay={0.1}>
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <CardTitle className="text-base">How Lessons Work</CardTitle>
            </div>
            <CardDescription>
              Each lesson follows these steps:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stagger>
              {[
                {
                  icon: Target,
                  title: "Read the goal",
                  desc: "Every lesson tells you what you're going to build. Look for the \"Your Goal\" panel in the workshop!",
                },
                {
                  icon: BookOpen,
                  title: "Read the story",
                  desc: "Chip sets up a fun scenario. The story card at the top of the workshop shows what's happening.",
                },
                {
                  icon: Blocks,
                  title: "Build with blocks",
                  desc: "Drag colorful blocks from the toolbox on the left. Each block does something different!",
                },
                {
                  icon: MonitorPlay,
                  title: "Test in the simulator",
                  desc: "Click the green \"Run\" button to see what your code does on the virtual M5Stick screen.",
                },
                {
                  icon: Lightbulb,
                  title: "Use hints if stuck",
                  desc: "Click \"Show Steps\" in the Goal panel, or open \"Lesson Info\" in the header to see all hints.",
                },
                {
                  icon: Zap,
                  title: "Complete the lesson",
                  desc: "When your code works like the goal says, click \"Complete Lesson\" and earn badges!",
                },
              ].map((step, i) => (
                <StaggerItem key={i}>
                  <li className="flex items-start gap-3 rounded-xl bg-muted/30 p-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="size-4 text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {i + 1}. {step.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                </StaggerItem>
              ))}
            </Stagger>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Workshop guide */}
      <FadeIn delay={0.15}>
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="size-5 text-primary" />
              <CardTitle className="text-base">Workshop Guide</CardTitle>
            </div>
            <CardDescription>
              The workshop is where you write code. Here&apos;s what you&apos;ll find:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Blocks,
                  title: "Blocks Editor",
                  desc: "Drag and connect blocks to write code. No typing needed!",
                },
                {
                  icon: MonitorPlay,
                  title: "Simulator",
                  desc: "A virtual M5Stick that shows what your code does.",
                },
                {
                  icon: MessageCircle,
                  title: "Chat with Chip",
                  desc: "Ask Chip for help anytime. Type a question in the chat box.",
                },
                {
                  icon: Target,
                  title: "Goal Panel",
                  desc: "Shows what you need to build and step-by-step hints.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl bg-muted/30 p-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Device setup */}
      <FadeIn delay={0.2}>
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Usb className="size-5 text-primary" />
              <CardTitle className="text-base">Device Setup</CardTitle>
            </div>
            <CardDescription>
              You can use TinkerSchool with or without the M5Stick device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 rounded-xl bg-emerald-500/10 p-3">
              <MonitorPlay className="size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  No device? No problem!
                </p>
                <p className="text-xs text-emerald-700/80">
                  Most lessons work with just the simulator. Look for the
                  &quot;Simulator Ready&quot; badge on lessons.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl bg-muted/30 p-3">
              <Usb className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Have an M5Stick?</p>
                <p className="text-xs text-muted-foreground">
                  Go to{" "}
                  <Link
                    href="/setup"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    Device Setup
                  </Link>{" "}
                  to connect it and flash the firmware.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quick links */}
      <FadeIn delay={0.25}>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/home">
              <Zap className="size-4" />
              Start Learning
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/subjects">
              <BookOpen className="size-4" />
              Browse Subjects
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/chat">
              <MessageCircle className="size-4" />
              Chat with Chip
            </Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
