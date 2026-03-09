"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Calculator,
  Bot,
  MessageSquare,
  ArrowRight,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const expectations = [
  {
    icon: GraduationCap,
    title: "Pick your child's grade level",
    description: "During signup, choose K, 1st, or 2nd grade to personalize the experience.",
    color: "#3B82F6",
  },
  {
    icon: Calculator,
    title: "Try a Math or Reading lesson",
    description: "Start with interactive lessons designed for hands-on, screen-friendly learning.",
    color: "#22C55E",
  },
  {
    icon: Bot,
    title: "Meet Chip, your child's AI buddy",
    description: "Chip guides kids through lessons with questions, hints, and encouragement.",
    color: "#F97316",
  },
  {
    icon: MessageSquare,
    title: "Share feedback to help us improve",
    description: "Your input shapes what TinkerSchool becomes. Every observation matters.",
    color: "#A855F7",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AlphaContent() {
  const prefersReducedMotion = useReducedMotion();

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeOut" as const };

  return (
    <div className="min-h-screen bg-background">
      {/* ----------------------------------------------------------------- */}
      {/* Nav Bar */}
      {/* ----------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="TinkerSchool"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              TinkerSchool
            </span>
          </Link>
          <Badge
            variant="outline"
            className="border-primary/30 text-primary text-xs font-semibold"
          >
            Alpha
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        {/* ----------------------------------------------------------------- */}
        {/* Hero Section */}
        {/* ----------------------------------------------------------------- */}
        <motion.section
          className="flex flex-col items-center text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} transition={transition}>
            <div className="relative mx-auto mb-6 size-20 sm:size-24">
              <Image
                src="/images/chip.png"
                alt="Chip, your AI learning buddy"
                fill
                className="rounded-2xl object-contain"
                priority
              />
              <motion.div
                className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.15, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="size-3.5" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            variants={fadeInUp}
            transition={transition}
          >
            Join the TinkerSchool Alpha
          </motion.h1>

          <motion.p
            className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            variants={fadeInUp}
            transition={transition}
          >
            An AI-powered learning platform that pairs kids with a friendly AI
            tutor named Chip to learn math, reading, science, and more through
            hands-on interactive lessons.
          </motion.p>

          <motion.div
            className={cn(
              "mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2",
              "border border-primary/20 bg-primary/5 text-sm font-medium text-primary"
            )}
            variants={fadeInUp}
            transition={transition}
          >
            <BookOpen className="size-4" />
            Looking for 5 families with kids in K-2nd grade
          </motion.div>
        </motion.section>

        {/* ----------------------------------------------------------------- */}
        {/* What to Expect */}
        {/* ----------------------------------------------------------------- */}
        <motion.section
          className="mt-16 sm:mt-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-center text-lg font-semibold text-foreground"
            variants={fadeInUp}
            transition={transition}
          >
            What to expect
          </motion.h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {expectations.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                transition={transition}
              >
                <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
                  <CardContent className="flex gap-4 p-5">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.color}14` }}
                    >
                      <item.icon
                        className="size-5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ----------------------------------------------------------------- */}
        {/* CTA Section */}
        {/* ----------------------------------------------------------------- */}
        <motion.section
          className="mt-16 sm:mt-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} transition={transition}>
            <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
              <CardContent className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-6 text-primary" />
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Ready to get started?
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Create your family account, add your child, and explore your
                    first lesson with Chip. It only takes a couple minutes.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 text-base font-semibold shadow-md"
                  >
                    <Link href="/sign-up">
                      Join the Alpha
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Free forever. No credit card needed.
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* ----------------------------------------------------------------- */}
        {/* Questions Section */}
        {/* ----------------------------------------------------------------- */}
        <motion.section
          className="mt-16 pb-8 sm:mt-20 sm:pb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.div
            className="flex flex-col items-center gap-3 text-center"
            variants={fadeInUp}
            transition={transition}
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Mail className="size-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              Questions?
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              We would love to hear from you. Reach out anytime and we will get
              back to you quickly.
            </p>

            <a
              href="mailto:alpha@tinkerschool.ai"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2",
                "text-sm font-medium text-primary underline-offset-4 hover:underline",
                "transition-colors duration-200"
              )}
            >
              <Mail className="size-4" />
              alpha@tinkerschool.ai
            </a>
          </motion.div>
        </motion.section>
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* Footer */}
      {/* ----------------------------------------------------------------- */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="TinkerSchool"
              width={20}
              height={20}
              className="rounded-md"
            />
            <span className="text-xs text-muted-foreground">
              TinkerSchool
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Open source. Made with care.
          </span>
        </div>
      </footer>
    </div>
  );
}
