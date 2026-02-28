"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  Bot,
  Brain,
  Cpu,
  Globe,
  Lightbulb,
  Sparkles,
  Heart,
  Monitor,
  Gamepad2,
  Volume2,
  Activity,
  Wifi,
  UsbIcon,
  Hand,
  Github,
  ArrowRight,
  ChevronRight,
  Zap,
  GraduationCap,
  Blocks,
  Wrench,
  Rocket,
  Star,
  Menu,
  X,
  ShoppingCart,
  ExternalLink,
  Users,
  Eye,
  Shield,
  MessageSquare,
  Lock,
  ChevronDown,
  Sprout,
  HeartHandshake,
  Timer,
  Tablet,
  Baby,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkshopDemo } from "@/components/workshop-demo";
import { TryChipDemo } from "@/components/try-chip-demo";
import { EmailCapture } from "@/components/email-capture";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const subjects = [
  {
    name: "Math",
    worldName: "Number World",
    icon: Calculator,
    color: "#3B82F6",
    description: "Numbers come alive with puzzles and real-world challenges",
    tagline: "Count it, beep it, tilt it, learn it.",
    lessonCount: 10,
    sampleLessons: ["Counting Machine", "Addition Adventure", "Shape Explorer"],
    deviceHighlight:
      "Press buttons to count. The buzzer beeps along. Tilt the device to scroll a number line. Math becomes something kids can hold.",
    standard: "Common Core Grade 1",
  },
  {
    name: "Reading",
    worldName: "Word World",
    icon: BookOpen,
    color: "#22C55E",
    description: "Adventure through stories and build a love of words",
    tagline: "Shake to shuffle. Spell with buttons. Read with Chip.",
    lessonCount: 10,
    sampleLessons: ["Letter Sounds", "Sight Word Sprint", "Spelling Bee"],
    deviceHighlight:
      "The buzzer sounds out letter hints. Shake the device to shuffle flashcards. Press buttons to spell words letter by letter -- each correct letter earns a happy beep.",
    standard: "Common Core ELA Grade 1",
  },
  {
    name: "Science",
    worldName: "Discovery Lab",
    icon: FlaskConical,
    color: "#F97316",
    description: "Explore the world with experiments you can touch and see",
    tagline: "Real sensors. Real data. Real discovery.",
    lessonCount: 10,
    sampleLessons: ["Sound Safari", "Weather Watch", "Light and Shadow"],
    deviceHighlight:
      "Feel the buzzer vibrate during a sound experiment. Measure actual temperature with a sensor HAT. The LED demonstrates light and shadow -- cause and effect in your hand.",
    standard: "NGSS Grade 1",
  },
  {
    name: "Music",
    worldName: "Sound Studio",
    icon: Music,
    color: "#A855F7",
    description: "Create beats, melodies, and sounds with real hardware",
    tagline: "Tilt for pitch. Tap for rhythm. Compose your first song.",
    lessonCount: 10,
    sampleLessons: ["Meet the Notes", "Beat Keeper", "My First Song"],
    deviceHighlight:
      "Tilt up for higher pitch, down for lower. Tap buttons to keep a steady beat. Compose a 4-note melody and hear it play back through the buzzer.",
    standard: "National Core Arts Standards",
  },
  {
    name: "Art",
    worldName: "Pixel Studio",
    icon: Palette,
    color: "#EC4899",
    description: "Draw, animate, and design on a real color display",
    tagline: "Mix colors. Draw pixels. Animate your imagination.",
    lessonCount: 10,
    sampleLessons: ["Pixel Power", "Color Mixing", "Symmetry Art"],
    deviceHighlight:
      "Buttons adjust RGB values and the screen fills with your color. Draw on one half -- the other half mirrors it automatically. Create 2-frame animations that bring your art to life.",
    standard: "National Core Arts Standards",
  },
  {
    name: "Problem Solving",
    worldName: "Puzzle Lab",
    icon: Puzzle,
    color: "#EAB308",
    description: "Think like an engineer and tackle fun brain teasers",
    tagline: "Tilt through mazes. Sort by shaking. Think step by step.",
    lessonCount: 10,
    sampleLessons: ["Spot the Pattern", "Maze Runner", "Code the Robot"],
    deviceHighlight:
      "Tilt the device to navigate a maze -- hit a wall and the buzzer sounds. Shake to sort items into categories. Press buttons to give a robot step-by-step instructions.",
    standard: "ISTE Standards",
  },
  {
    name: "Coding",
    worldName: "Code Lab",
    icon: Code2,
    color: "#14B8A6",
    description: "Build real programs that run on your own device",
    tagline: "Drag blocks. See Python. Flash to your device.",
    lessonCount: 10,
    sampleLessons: ["Hello, Computer!", "Music Box", "Shake Magic"],
    deviceHighlight:
      "Drag visual blocks, peek at the Python code underneath, and flash it to your device in one click. Build a Magic 8-Ball, an Etch-a-Sketch, and your own game.",
    standard: "CSTA K-12 Standards",
  },
  {
    name: "Social-Emotional",
    worldName: "Feelings & Friends",
    icon: HeartHandshake,
    color: "#F472B6",
    description: "Learn about emotions, kindness, sharing, and being a good friend",
    tagline: "Name it, breathe it, share it, grow.",
    lessonCount: 8,
    sampleLessons: ["Naming Emotions", "Calm-Down Breathing", "Kindness Actions"],
    deviceHighlight:
      "Press buttons to pick how you feel. The screen shows emotion faces. Breathe along with the LED pulse. Practice taking turns with a friend using the buzzer timer.",
    standard: "CASEL Framework",
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

const deviceFeatures = [
  { icon: Monitor, label: '1.14" color display' },
  { icon: Gamepad2, label: "2 tactile buttons" },
  { icon: Volume2, label: "Buzzer for sound experiments" },
  { icon: Activity, label: "Motion sensors for physical learning" },
  { icon: Wifi, label: "WiFi for multiplayer activities" },
  { icon: UsbIcon, label: "USB-C connection to any computer" },
  { icon: Hand, label: "Fits in a kid's hand" },
] as const;

interface BandInfo {
  band: number;
  name: string;
  grades: string;
  ages: string;
  mode: string;
  description: string;
  highlight?: boolean;
}

const bands: BandInfo[] = [
  {
    band: 0,
    name: "Seedling",
    grades: "Pre-K",
    ages: "3-5",
    mode: "Guided play",
    description: "40 interactive lessons across 8 subjects. No device needed — works on any tablet or computer.",
    highlight: true,
  },
  {
    band: 1,
    name: "Explorer",
    grades: "K",
    ages: "5-6",
    mode: "Interactive activities",
    description: "Hands-on counting, letters, and discovery through playful activities.",
  },
  {
    band: 2,
    name: "Builder",
    grades: "1",
    ages: "6-7",
    mode: "UIFlow2 blocks",
    description: "Drag-and-drop visual blocks introduce foundational concepts.",
    highlight: true,
  },
  {
    band: 3,
    name: "Inventor",
    grades: "2-3",
    ages: "7-9",
    mode: 'Blocks + "peek at Python"',
    description:
      "Build with blocks and peek at the Python code underneath.",
  },
  {
    band: 4,
    name: "Hacker",
    grades: "3-4",
    ages: "8-10",
    mode: "MicroPython + block hints",
    description: "Transition to text-based coding with block scaffolding.",
  },
  {
    band: 5,
    name: "Creator",
    grades: "4-5",
    ages: "9-11",
    mode: "MicroPython + AI assist",
    description: "Write Python with AI-powered coding assistance.",
  },
  {
    band: 6,
    name: "Innovator",
    grades: "5-6",
    ages: "10-12",
    mode: "Full MicroPython + AI",
    description:
      "Independent coding with full language access and AI collaboration.",
  },
];

const builderModules = [
  {
    title: "Hello M5Stick!",
    icon: Monitor,
    color: "#3B82F6",
    lessons: [
      "Light It Up",
      "Color My World",
      "Button Magic",
      "Beep Boop",
      "LED Light Show",
    ],
  },
  {
    title: "Drawing Fun!",
    icon: Palette,
    color: "#EC4899",
    lessons: ["Pixel Art", "Shape Painter", "Animation Station"],
  },
  {
    title: "Shake & Count!",
    icon: Activity,
    color: "#EAB308",
    lessons: ["Shake It Up!", "Counting Shakes", "Dice Roller", "Magic 8-Ball"],
  },
  {
    title: "DJ Stick!",
    icon: Music,
    color: "#A855F7",
    lessons: ["My First Piano", "Song Player", "Sound Effects Machine"],
  },
  {
    title: "Tilt Games!",
    icon: Gamepad2,
    color: "#14B8A6",
    lessons: ["Tilt-o-Meter", "Balance Game", "Tilt Maze"],
  },
];

const supporterPillars = [
  {
    icon: Brain,
    title: "AI Tutoring",
    description: "Powers Chip's personalized teaching for every child, every subject.",
  },
  {
    icon: Heart,
    title: "Open Source",
    description: "Keeps the platform free for every family, everywhere.",
  },
  {
    icon: Rocket,
    title: "Future Features",
    description: "Funds new subjects, activities, and learning tools.",
  },
] as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const, delay: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

// ---------------------------------------------------------------------------
// Landing Page Content
// ---------------------------------------------------------------------------

export function LandingContent() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const motionProps = (variants: typeof fadeInUp) =>
    prefersReducedMotion
      ? {}
      : {
          initial: variants.initial,
          whileInView: variants.animate,
          viewport: { once: true, margin: "-60px" },
          transition: variants.transition,
        };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ================================================================= */}
      {/* Navigation Bar (outside <main> since it's site-wide chrome) */}
      {/* ================================================================= */}
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-foreground">
              TinkerSchool
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/demo"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Try Demo
            </Link>
            <a
              href="#subjects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Subjects
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#device"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Device
            </a>
            <a
              href="#curriculum"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Curriculum
            </a>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </div>

          {/* CTA buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl text-sm"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-6 text-sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-6 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Try Demo
              </Link>
              <a
                href="#subjects"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Subjects
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Features
              </a>
              <a
                href="#device"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Device
              </a>
              <a
                href="#curriculum"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Curriculum
              </a>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Blog
              </Link>
              <div className="flex gap-3 pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="flex-1 rounded-full">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
      {/* ================================================================= */}
      {/* Section 1: Hero -- clean white bg, orange in text + buttons only */}
      {/* ================================================================= */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32">
        {/* Subtle radial glow -- barely visible, just enough warmth */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 text-center"
          {...motionProps(fadeInUp)}
        >
          {/* Chip mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Image
              src="/images/chip.png"
              alt="Chip, your AI learning buddy"
              width={120}
              height={120}
              className="drop-shadow-lg"
              priority
            />
          </motion.div>

          {/* Logo + Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 sm:size-14">
              <Lightbulb className="size-7 text-primary-foreground sm:size-8" />
            </div>
            <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              TinkerSchool
            </span>
          </div>

          {/* Age/price badge */}
          <Badge
            variant="outline"
            className="rounded-full border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70"
          >
            Ages 3-12 · Pre-K to 6th Grade · Free
          </Badge>

          {/* H1 Tagline -- optimized for SEO */}
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            AI-Powered Hands-On Learning for Kids Ages 3-12
            <br />
            <span className="text-primary">Math · Reading · Science · Music · Art · Coding</span>
          </h1>

          {/* Description */}
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Where every kid is a genius waiting to bloom. Chip, your AI buddy,
            guides your child through 8 subjects with hands-on STEM activities
            and interactive lessons — from Pre-K guided play to 6th grade coding. Perfect for homeschooling, afterschooling,
            or pushing beyond what school teaches.
          </p>

          {/* CTAs -- pill shaped */}
          <div className="flex gap-4 pt-4">
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base shadow-md shadow-primary/25 sm:text-lg"
              >
                <Link href="/demo">
                  Try a Free Lesson
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base sm:text-lg"
              >
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </motion.div>
          </div>

          {/* Open source subtext */}
          <p className="flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
            <Github className="size-3.5" />
            100% free software · Optional $29 device · No credit card required
          </p>

          {/* Parent trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="size-3.5" />
              Parent dashboard
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5" />
              AI safety guardrails
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-3.5" />
              All chats logged
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5" />
              COPPA compliant
            </span>
          </div>
        </motion.div>

        {/* Subject color dots -- visual interest without overwhelming */}
        <motion.div
          className="relative z-10 mt-16 flex items-center gap-3"
          {...motionProps({
            ...fadeInUp,
            transition: { ...fadeInUp.transition, delay: 0.2 },
          })}
        >
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="flex size-10 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-110 sm:size-12"
              style={{ backgroundColor: `${subject.color}14` }}
              title={subject.name}
            >
              <subject.icon
                className="size-5 sm:size-6"
                style={{ color: subject.color }}
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 1a: Pre-K Spotlight */}
      {/* ================================================================= */}
      <section className="flex flex-col items-center gap-8 px-6 py-16">
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          {...motionProps(fadeInUp)}
        >
          <Badge className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            NEW — Now starting at age 3
          </Badge>
          <div className="flex items-center gap-2">
            <Sprout className="size-6 text-emerald-500" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Pre-K: Guided Play for Ages 3-5
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            40 interactive lessons across 8 subjects — including social-emotional
            learning. No hardware needed. Works on any tablet, phone, or computer.
            Built for little hands and short attention spans.
          </p>
        </motion.div>

        <motion.div
          className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {[
            {
              icon: Tablet,
              title: "No Device Needed",
              desc: "100% browser-based. Works on tablets, phones, and laptops.",
            },
            {
              icon: Users,
              title: "Parent Co-Play",
              desc: "Every lesson includes off-screen activities for parents and kids together.",
            },
            {
              icon: Timer,
              title: "Screen Time Built In",
              desc: "10-minute sessions with cool-down breaks. Body movement prompts every 2 activities.",
            },
            {
              icon: HeartHandshake,
              title: "Social-Emotional Learning",
              desc: "Name emotions, practice kindness, calm-down breathing — a full 8th subject.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={prefersReducedMotion ? {} : staggerItem}
            >
              <Card className="h-full rounded-2xl border shadow-sm">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <item.icon className="size-5 text-emerald-500" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pre-K subject pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          {...motionProps({
            ...fadeInUp,
            transition: { ...fadeInUp.transition, delay: 0.1 },
          })}
        >
          {[
            { name: "Counting Corner", icon: Calculator, color: "#3B82F6" },
            { name: "Story Time", icon: BookOpen, color: "#22C55E" },
            { name: "Wonder Lab", icon: FlaskConical, color: "#F97316" },
            { name: "Music Garden", icon: Music, color: "#A855F7" },
            { name: "Color Play", icon: Palette, color: "#EC4899" },
            { name: "Think & Play", icon: Puzzle, color: "#EAB308" },
            { name: "Step by Step", icon: Code2, color: "#14B8A6" },
            { name: "Feelings & Friends", icon: HeartHandshake, color: "#F472B6" },
          ].map((mod) => (
            <span
              key={mod.name}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: `${mod.color}14`,
                color: mod.color,
              }}
            >
              <mod.icon className="size-3.5" />
              {mod.name}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 1b: Try Chip Now -- Interactive AI Demo */}
      {/* ================================================================= */}
      <section
        id="try-chip"
        className="flex flex-col items-center gap-8 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Bot className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Try It Right Now
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Chat with Chip, build something cool, and watch it run on a
            tiny computer — no sign-up required.
          </p>
        </motion.div>

        <motion.div
          className="w-full"
          {...motionProps({
            ...fadeInUp,
            transition: { ...fadeInUp.transition, delay: 0.1 },
          })}
        >
          <TryChipDemo />
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 1c: Workshop Preview (static demo) */}
      {/* ================================================================= */}
      <section
        id="demo"
        className="flex flex-col items-center gap-8 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Blocks className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              See the Workshop
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Drag blocks, peek at Python, and watch code run on a real device --
            all from the browser.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-4xl"
          {...motionProps({
            ...fadeInUp,
            transition: { ...fadeInUp.transition, delay: 0.1 },
          })}
        >
          <WorkshopDemo />
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 2: Subject Showcase */}
      {/* ================================================================= */}
      <section
        id="subjects"
        className="flex flex-col items-center gap-10 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              8 Subjects, Infinite Curiosity
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every subject is an adventure. Younger kids explore through
            interactive play, older kids press buttons, shake sensors, hear
            buzzers, and see results on a real screen.
          </p>
        </motion.div>

        {/* Subject cards -- richer layout */}
        <motion.div
          className="flex w-full max-w-5xl flex-col gap-3"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {subjects.map((subject) => (
            <motion.div
              key={subject.name}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card
                className="overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-200 hover:shadow-md"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: subject.color,
                }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:gap-6">
                    {/* Left: subject identity + tagline */}
                    <div className="flex flex-col gap-3 md:w-[260px] md:shrink-0">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${subject.color}1F`,
                          }}
                        >
                          <subject.icon
                            className="size-5"
                            style={{ color: subject.color }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-base font-semibold"
                            style={{ color: subject.color }}
                          >
                            {subject.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {subject.worldName}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium italic text-muted-foreground">
                        &ldquo;{subject.tagline}&rdquo;
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          {subject.lessonCount} lessons
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          {subject.standard}
                        </Badge>
                      </div>
                    </div>

                    {/* Right: device highlight + sample lessons */}
                    <div className="flex flex-1 flex-col gap-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {subject.deviceHighlight}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subject.sampleLessons.map((lesson) => (
                          <span
                            key={lesson}
                            className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${subject.color}14`,
                              color: subject.color,
                            }}
                          >
                            <ChevronRight className="size-3" />
                            {lesson}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Cross-subject connection callout */}
        <motion.div
          className="w-full max-w-5xl"
          {...motionProps({
            ...fadeInUp,
            transition: { ...fadeInUp.transition, delay: 0.1 },
          })}
        >
          <Card className="rounded-2xl border-primary/30 bg-primary/[0.05]">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Subjects Connect, Not Compete
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Math patterns become music rhythms. Reading story structure
                mirrors coding sequences. Science measurement is math counting.
                Art coordinates connect to geometry. Chip weaves these
                connections naturally -- helping kids see the bigger picture.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
                {subjects.map((s, i) => (
                  <span key={s.name} className="flex items-center gap-1">
                    <span
                      className="flex size-8 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${s.color}1F` }}
                    >
                      <s.icon
                        className="size-4"
                        style={{ color: s.color }}
                      />
                    </span>
                    {i < subjects.length - 1 && (
                      <span
                        className="mx-0.5 h-px w-3"
                        style={{ backgroundColor: `${s.color}40` }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 3: Features / How It Works */}
      {/* ================================================================= */}
      <section
        id="features"
        className="flex flex-col items-center gap-10 bg-muted/30 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Heart className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Built for How Kids Actually Learn
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Not another screen. A toolkit for discovery, creativity, and
            confidence.
          </p>
        </motion.div>

        <motion.div
          className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="h-full rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 4: Device Showcase */}
      {/* ================================================================= */}
      <section
        id="device"
        className="flex flex-col items-center gap-12 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Cpu className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              The Classroom in Your Hand
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            The M5StickC Plus 2 is a tiny computer that brings learning to life.
            Write code and see it run instantly.
          </p>
        </motion.div>

        <div className="grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
          {/* Device illustration */}
          <motion.div
            className="flex items-center justify-center"
            {...motionProps(fadeInUp)}
          >
            <div className="relative">
              {/* Ambient glow behind device */}
              <div className="absolute -inset-8 rounded-full bg-primary/[0.06] blur-2xl" />
              {/* Device body */}
              <div className="relative flex h-[280px] w-[160px] flex-col items-center rounded-3xl bg-gradient-to-b from-zinc-700 to-zinc-800 p-3 shadow-2xl">
                {/* Screen */}
                <div className="flex h-[180px] w-[108px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">Hello!</p>
                    <p className="mt-1 text-xs text-white/80">TinkerSchool</p>
                  </div>
                </div>
                {/* Buttons */}
                <div className="mt-4 flex gap-6">
                  <div className="size-8 rounded-full bg-zinc-600 shadow-inner" />
                  <div className="size-8 rounded-full bg-zinc-600 shadow-inner" />
                </div>
                {/* LED */}
                <div className="mt-3 size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
              {/* Ground shadow */}
              <div className="absolute -bottom-4 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/10 blur-lg" />
            </div>
          </motion.div>

          {/* Feature checklist */}
          <motion.div
            className="space-y-4"
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
          >
            {deviceFeatures.map((feat) => (
              <motion.div
                key={feat.label}
                className="flex items-center gap-4"
                variants={prefersReducedMotion ? {} : staggerItem}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <feat.icon className="size-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground sm:text-base">
                  {feat.label}
                </span>
              </motion.div>
            ))}

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                Works with any Chromebook, Mac, or Windows laptop.
              </p>
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                className="inline-block"
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl text-base"
                >
                  <a
                    href="https://www.amazon.com/dp/B0F3XQ22XS"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShoppingCart className="mr-2 size-5" />
                    Get It on Amazon — ~$29
                    <ExternalLink className="ml-2 size-4" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section 5: Curriculum Bands */}
      {/* ================================================================= */}
      <section
        id="curriculum"
        className="flex flex-col items-center gap-10 bg-muted/30 px-6 py-20"
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Learning Paths for Every Stage
            </h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
            Seven progressive bands take kids from guided play to full Python,
            meeting them exactly where they are.
          </p>
        </motion.div>

        <motion.div
          className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {bands.map((band) => {
            const bandIcons = [Sprout, Blocks, Wrench, Lightbulb, Rocket, Star, Sparkles];
            const BandIcon = bandIcons[band.band];

            return (
              <motion.div
                key={band.band}
                variants={prefersReducedMotion ? {} : staggerItem}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card
                  className={cn(
                    "relative h-full rounded-2xl transition-shadow duration-200 hover:shadow-md",
                    band.highlight && "border-primary/40 shadow-sm"
                  )}
                >
                  {band.highlight && (
                    <Badge className={cn(
                      "absolute -top-2.5 right-4 rounded-full px-3 text-xs text-primary-foreground",
                      band.band === 0 ? "bg-emerald-500" : "bg-primary"
                    )}>
                      {band.band === 0 ? "NEW" : "Cassidy starts here"}
                    </Badge>
                  )}
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <BandIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          {band.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Grades {band.grades} &middot; Ages {band.ages}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {band.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="w-fit text-xs text-muted-foreground"
                    >
                      {band.mode}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Peek Inside: Builder Band */}
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <div className="flex items-center gap-2">
            <Wrench className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Peek Inside: Builder Band
            </h3>
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            5 modules &middot; 16 hands-on lessons
          </Badge>
        </motion.div>

        <motion.div
          className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {builderModules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                variants={prefersReducedMotion ? {} : staggerItem}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card
                  className="h-full rounded-2xl border-l-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  style={{
                    borderLeftColor: mod.color,
                    backgroundColor: `${mod.color}14`,
                  }}
                >
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${mod.color}1F` }}
                      >
                        <ModIcon
                          className="size-5"
                          style={{ color: mod.color }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-foreground">
                          {mod.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-xs leading-none"
                        >
                          {mod.lessons.length}
                        </Badge>
                      </div>
                    </div>
                    <ol className="flex flex-col gap-1.5 pl-1">
                      {mod.lessons.map((lesson, i) => (
                        <li
                          key={lesson}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: mod.color }}
                          >
                            {i + 1}
                          </span>
                          {lesson}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 6: Why TinkerSchool / Stats */}
      {/* ================================================================= */}
      <section className="flex flex-col items-center gap-10 px-6 py-20">
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          {...motionProps(fadeInUp)}
        >
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Why Families Choose TinkerSchool
          </h2>
        </motion.div>

        <motion.div
          className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {[
            { value: "8", label: "Subjects" },
            { value: "7", label: "Learning Bands" },
            { value: "100%", label: "Free & Open Source" },
            { value: "Pre-K\u20136", label: "Grade Range" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-6 text-center shadow-sm"
              variants={prefersReducedMotion ? {} : staggerItem}
            >
              <span className="text-3xl font-bold text-primary">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          {...motionProps(fadeInUp)}
        >
          <a
            href="https://github.com/jonathanhawkins/tinkerschool"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge
              variant="outline"
              className="gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Github className="size-4" />
              Open Source on GitHub
            </Badge>
          </a>
          <Badge
            variant="outline"
            className="gap-2 rounded-full px-4 py-2 text-sm"
          >
            <Bot className="size-4" />
            Powered by Claude AI
          </Badge>
          <a
            href="https://www.amazon.com/dp/B0F3XQ22XS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge
              variant="outline"
              className="gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              <ShoppingCart className="size-4" />
              Device ~$29 on Amazon
              <ExternalLink className="size-3 text-muted-foreground" />
            </Badge>
          </a>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 6b: Supported by Families */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-primary/[0.04] px-6 py-20">
        {/* Warm radial accent */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10">
          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            {...motionProps(fadeInUp)}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Free Because of Families Like Yours
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              TinkerSchool is free and open source. Every lesson, every subject,
              every AI conversation — always free. Supporters help cover the
              cost of AI tutoring so every kid can learn, regardless of their
              family&apos;s budget.
            </p>
          </motion.div>

          <motion.div
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3"
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
          >
            {supporterPillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={prefersReducedMotion ? {} : staggerItem}
              >
                <Card className="h-full rounded-2xl border bg-card shadow-sm">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <pillar.icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...motionProps(fadeInUp)}>
            <Link
              href="/support"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Learn more about supporting TinkerSchool
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section 7: CTA */}
      {/* ================================================================= */}
      <section className="bg-gradient-to-r from-primary via-primary to-[#EA580C] px-6 py-20">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
          {...motionProps(fadeInUp)}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Tinkering?
          </h2>
          <p className="max-w-md text-base text-white/80">
            Join TinkerSchool and give your child a learning experience that
            combines AI, real hardware, and curiosity-driven projects.
          </p>
          <motion.div
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full bg-white px-10 text-base font-semibold text-primary shadow-lg hover:bg-white/90 sm:text-lg"
            >
              <Link href="/sign-up">
                Create Free Account
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </motion.div>
          <p className="text-sm text-white/60">
            No credit card required. Always free. Always open source.
          </p>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* Section 8: FAQ */}
      {/* ================================================================= */}
      <section id="faq" className="bg-muted/30 px-6 py-20">
        <motion.div
          className="mx-auto max-w-3xl"
          {...motionProps(fadeInUp)}
        >
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Everything parents ask before getting started.
          </p>

          <div className="divide-y divide-border rounded-2xl border border-border bg-background shadow-sm">
            {[
              {
                q: "What is TinkerSchool?",
                a: "TinkerSchool is an open-source, AI-powered education platform for kids ages 3\u201312. It covers math, reading, science, music, art, problem solving, coding, and social-emotional learning through hands-on projects and a personal AI tutor named Chip. Pre-K kids (ages 3\u20135) learn through guided play on any device, while older kids build with real hardware.",
              },
              {
                q: "Is TinkerSchool really free?",
                a: "Yes, completely free and open source. Supporters help fund AI tutoring costs, but every lesson and feature is available to all families at no charge.",
              },
              {
                q: "What ages is TinkerSchool designed for?",
                a: "TinkerSchool is designed for Pre-K through 6th grade (ages 3\u201312) with seven progressive bands. Pre-K (Seedling) offers 40 interactive lessons across 8 subjects with no hardware needed \u2014 perfect for tablets. Older bands introduce block coding, text coding, and real hardware projects. Each band adapts content and difficulty to the child\u2019s level.",
              },
              {
                q: "How does the AI tutor Chip work?",
                a: "Chip is a personal AI learning buddy powered by Claude. Chip guides kids through leading questions, never gives away answers, and adapts to each child\u2019s learning style and interests. All conversations are logged so parents can review them anytime.",
              },
              {
                q: "Do I need to buy the M5StickC hardware?",
                a: "No! TinkerSchool works with a built-in simulator for trying lessons on any device. The M5StickC Plus 2 (~$20) adds hands-on hardware projects but isn\u2019t required to get started.",
              },
              {
                q: "Is TinkerSchool safe for children?",
                a: "Yes, fully COPPA-compliant. Kids use PIN-based login (no email required), all data is family-scoped, AI conversations are logged for parent review, and content has strict safety guardrails.",
              },
              {
                q: "Can I use TinkerSchool for homeschooling?",
                a: "Absolutely! TinkerSchool covers all core subjects with personalized AI tutoring. Many families use it as a primary homeschool curriculum or as supplemental afterschooling.",
              },
              {
                q: "How is TinkerSchool different from other learning apps?",
                a: "TinkerSchool combines an AI tutor, real hardware projects, and all school subjects in one platform. Kids build real things \u2014 not just watch videos or answer multiple-choice questions.",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

      </section>

      {/* ================================================================= */}
      {/* Section 8b: Email Capture */}
      {/* ================================================================= */}
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-xl"
          {...motionProps(fadeInUp)}
        >
          <EmailCapture
            source="landing_page"
            heading="Stay in the loop"
            description="Free schedule templates, STEM activity ideas, and learning tips for kids ages 3-12. Join our growing community of homeschool and Pre-K families."
            buttonText="Subscribe"
            variant="card"
          />
        </motion.div>
      </section>

      </main>

      {/* ================================================================= */}
      {/* Section 9: Footer */}
      {/* ================================================================= */}
      <footer className="border-t border-border bg-muted/20 px-6 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {/* Product */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              {["Features", "Subjects", "Curriculum", "Device"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Community</h3>
            <ul className="space-y-2">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/jonathanhawkins/tinkerschool",
                },
                { label: "Discord", href: "https://github.com/jonathanhawkins/tinkerschool/discussions" },
                {
                  label: "Contributing",
                  href: "https://github.com/jonathanhawkins/tinkerschool",
                },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Parents */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Parents</h3>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Child Safety", href: "/privacy#parental-rights" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "Support Us", href: "/support" },
                { label: "About", href: "https://github.com/jonathanhawkins/tinkerschool" },
                { label: "Contact", href: "mailto:hello@tinkerschool.ai" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-medium text-foreground">
              TinkerSchool.ai
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Made with{" "}
            <Heart className="inline size-3.5 fill-current text-pink-500" /> for
            curious kids everywhere
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TinkerSchool. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}
