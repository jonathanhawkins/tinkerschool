import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  Bot,
  Cpu,
  Globe,
  Lightbulb,
  Sparkles,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const subjects = [
  {
    name: "Math",
    icon: Calculator,
    color: "#3B82F6",
    description: "Numbers come alive with puzzles and real-world challenges",
  },
  {
    name: "Reading",
    icon: BookOpen,
    color: "#22C55E",
    description: "Adventure through stories and build a love of words",
  },
  {
    name: "Science",
    icon: FlaskConical,
    color: "#F97316",
    description: "Explore the world with experiments you can touch and see",
  },
  {
    name: "Music",
    icon: Music,
    color: "#A855F7",
    description: "Create beats, melodies, and sounds with code",
  },
  {
    name: "Art",
    icon: Palette,
    color: "#EC4899",
    description: "Draw, animate, and design with digital creativity tools",
  },
  {
    name: "Problem Solving",
    icon: Puzzle,
    color: "#EAB308",
    description: "Think like an engineer and tackle fun brain teasers",
  },
  {
    name: "Coding",
    icon: Code2,
    color: "#14B8A6",
    description: "Build real programs that run on your own device",
  },
] as const;

const features = [
  {
    icon: Bot,
    title: "AI Buddy Chip",
    description:
      "A personal AI tutor that learns how each kid thinks. Chip never gives answers -- instead, it asks the right questions to spark discovery.",
  },
  {
    icon: Cpu,
    title: "Hands-On Hardware",
    description:
      "The M5StickC Plus 2 brings lessons to life. Kids write code and see it run on a real device with a screen, buttons, sensors, and a buzzer.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Free curriculum, community-powered. Every lesson, tool, and resource is open for parents and educators to use, remix, and improve.",
  },
] as const;

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section
        className={cn(
          "relative flex flex-col items-center justify-center gap-8 px-6 py-24 text-center",
          "bg-gradient-to-br from-[#3B82F6]/10 via-[#A855F7]/10 to-[#EC4899]/10"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              TinkerSchool
            </h1>
          </div>

          <p className="max-w-2xl text-xl font-medium text-primary sm:text-2xl">
            Where every kid is a genius waiting to bloom
          </p>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Meet Chip, your AI buddy. Together you will explore math, reading,
            science, music, art, problem solving, and coding -- all through
            hands-on projects.
          </p>

          <div className="flex gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-base shadow-md sm:text-lg"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base shadow-sm sm:text-lg"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subject Showcase */}
      <section className="flex flex-col items-center gap-10 px-6 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              7 Subjects, Infinite Curiosity
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Every subject is an adventure. Kids learn by building real projects
            that connect ideas across disciplines.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className={cn(
                "group rounded-2xl border-0 shadow-md transition-all duration-200",
                "hover:-translate-y-1 hover:shadow-lg"
              )}
              style={{
                backgroundColor: `${subject.color}08`,
                borderLeft: `4px solid ${subject.color}`,
              }}
            >
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${subject.color}18` }}
                  >
                    <subject.icon
                      className="h-5 w-5"
                      style={{ color: subject.color }}
                    />
                  </div>
                  <h3
                    className="text-base font-semibold"
                    style={{ color: subject.color }}
                  >
                    {subject.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {subject.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="flex flex-col items-center gap-10 bg-muted/30 px-6 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Built for How Kids Actually Learn
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Not another screen. A toolkit for discovery, creativity, and
            confidence.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-center px-6 py-10">
        <p className="text-sm text-muted-foreground">
          TinkerSchool.ai - Open Source Education for Everyone
        </p>
      </footer>
    </div>
  );
}
