import Link from "next/link";
import { Usb, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Device Enhancement Card - Suggests M5Stick projects related to a lesson
// ---------------------------------------------------------------------------
// Shown below interactive lessons to encourage hardware exploration.
// Entirely optional -- never blocks lesson completion.
// ---------------------------------------------------------------------------

interface DeviceEnhancementCardProps {
  /** Subject slug for the current lesson */
  subjectSlug: string | null;
  /** Subject color for theming */
  subjectColor: string;
  /** Lesson title for context */
  lessonTitle: string;
  /** Optional lesson ID to link directly to workshop with lesson context */
  lessonId?: string;
}

/** Subject-specific M5Stick project suggestions */
const DEVICE_SUGGESTIONS: Record<
  string,
  { title: string; description: string }
> = {
  math: {
    title: "Math on Your M5Stick!",
    description:
      "Try displaying your math answers on the M5Stick screen! Open the workshop to make a program that shows numbers and colors on the display.",
  },
  reading: {
    title: "Story Display on M5Stick!",
    description:
      "Create a scrolling story on your M5Stick display! Open the workshop and make words appear one by one with cool colors.",
  },
  science: {
    title: "Science Sensor Experiment!",
    description:
      "Use the M5Stick's motion sensor to do a real science experiment! Measure how fast you can shake it or tilt it different ways.",
  },
  music: {
    title: "Make Music with M5Stick!",
    description:
      "Turn your M5Stick into an instrument! Use the buzzer to play the notes and melodies from your lesson.",
  },
  art: {
    title: "Digital Art on M5Stick!",
    description:
      "Draw pixel art on the tiny M5Stick screen! Use code blocks to create colorful patterns and designs.",
  },
  "problem-solving": {
    title: "Puzzle Gadget Project!",
    description:
      "Build a puzzle game on your M5Stick! Use the buttons to navigate and solve challenges on the small screen.",
  },
  coding: {
    title: "Code It on M5Stick!",
    description:
      "Take what you learned and run it on real hardware! Open the workshop to write code that lights up the display.",
  },
  "social-emotional": {
    title: "Feelings on M5Stick!",
    description:
      "Display emotion faces on your M5Stick screen! Build a mood check-in tool with buttons to pick how you feel and watch the LED pulse as you practice calm breathing.",
  },
};

const DEFAULT_SUGGESTION = {
  title: "Bring It to Life on M5Stick!",
  description:
    "Take what you learned in this lesson and make it come alive on your M5Stick device! Open the workshop to start building.",
};

export function DeviceEnhancementCard({
  subjectSlug,
  subjectColor,
  lessonTitle,
  lessonId,
}: DeviceEnhancementCardProps) {
  const suggestion =
    (subjectSlug ? DEVICE_SUGGESTIONS[subjectSlug] : null) ??
    DEFAULT_SUGGESTION;

  return (
    <Card className="rounded-2xl border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subjectColor}1F` }}
          >
            <Usb className="size-4" style={{ color: subjectColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm">{suggestion.title}</CardTitle>
            <CardDescription className="text-xs">
              Bonus activity - optional!
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="gap-1 border-primary/30 text-xs text-primary"
          >
            <Sparkles className="size-3" />
            Bonus
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {suggestion.description}
        </p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl"
        >
          <Link href={lessonId ? `/workshop?lessonId=${lessonId}` : "/workshop"}>
            Open Workshop
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
