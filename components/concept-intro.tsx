"use client";

/**
 * ConceptIntro -- Visual, kid-friendly concept introduction cards.
 *
 * Appears inline on the lesson page before the "Start Coding" CTA to
 * introduce programming concepts that the lesson will use. Each concept
 * is presented as a small card with:
 * - An icon and color associated with the concept
 * - A kid-friendly title
 * - A real-world analogy (e.g., "Loops are like doing something over and over")
 * - A simple visual demo animation
 *
 * Only shows concepts that the kid hasn't seen before (tracked via
 * useTutorialProgress). After viewing, concepts are marked as seen.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Repeat,
  GitBranch,
  Variable,
  Palette,
  Volume2,
  Clock,
  MousePointer2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTutorialProgress } from "@/hooks/use-tutorial-progress";

// ---------------------------------------------------------------------------
// Concept Definitions
// ---------------------------------------------------------------------------

export interface ConceptDefinition {
  /** Unique ID matching toolbox categories or programming concept names */
  id: string;
  /** Kid-friendly concept name */
  title: string;
  /** One-line real-world analogy */
  analogy: string;
  /** Slightly longer explanation for curious kids */
  explanation: string;
  /** Icon component */
  icon: LucideIcon;
  /** Theme color (hex) */
  color: string;
  /** Which Blockly toolbox categories this concept maps to */
  toolboxCategories: string[];
}

const CONCEPT_LIBRARY: ConceptDefinition[] = [
  {
    id: "display",
    title: "Display Blocks",
    analogy: "Like writing on a tiny whiteboard!",
    explanation:
      "Display blocks let you show words, numbers, and shapes on your M5Stick's little screen. It's like drawing on a mini whiteboard!",
    icon: Palette,
    color: "#9C27B0",
    toolboxCategories: ["Display"],
  },
  {
    id: "sound",
    title: "Sound Blocks",
    analogy: "Make your M5Stick sing!",
    explanation:
      "Sound blocks play tones through the buzzer. You can make music, sound effects, or silly noises!",
    icon: Volume2,
    color: "#FF9800",
    toolboxCategories: ["Sound"],
  },
  {
    id: "loops",
    title: "Loops",
    analogy: "Like doing jumping jacks 10 times!",
    explanation:
      "A loop repeats things over and over. Instead of writing the same block 10 times, you put it inside a loop and tell it how many times to repeat.",
    icon: Repeat,
    color: "#22C55E",
    toolboxCategories: ["Loops"],
  },
  {
    id: "logic",
    title: "If / Then Decisions",
    analogy: "Like choosing: if it rains, take an umbrella!",
    explanation:
      "Logic blocks help your code make decisions. If something is true, do one thing. Otherwise, do something else!",
    icon: GitBranch,
    color: "#3B82F6",
    toolboxCategories: ["Logic"],
  },
  {
    id: "variables",
    title: "Variables",
    analogy: "Like a box with a label that holds a number or word!",
    explanation:
      "A variable is like a labeled box. You can put a number or word inside, and use it later. You can even change what's in the box!",
    icon: Variable,
    color: "#EC4899",
    toolboxCategories: ["Variables"],
  },
  {
    id: "wait",
    title: "Wait / Timing",
    analogy: "Like pausing between dance moves!",
    explanation:
      "Wait blocks add a pause between actions. This lets you control the timing -- like showing a message, waiting 2 seconds, then showing the next one.",
    icon: Clock,
    color: "#9E9E9E",
    toolboxCategories: ["Wait"],
  },
  {
    id: "buttons",
    title: "Button Blocks",
    analogy: "Like pressing a doorbell!",
    explanation:
      "Button blocks check if you pressed a button on the M5Stick. You can make different things happen when you press Button A or Button B!",
    icon: MousePointer2,
    color: "#4CAF50",
    toolboxCategories: ["Buttons"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Re-export for convenience (the function also lives in lib/tutorials/detect-concepts.ts
// for use in Server Components where importing from a client module is not ideal).
export { detectConceptsForLesson } from "@/lib/tutorials/detect-concepts";

// ---------------------------------------------------------------------------
// Individual Concept Card
// ---------------------------------------------------------------------------

function ConceptCard({
  concept,
  index,
  isNew,
  onMarkSeen,
}: {
  concept: ConceptDefinition;
  index: number;
  isNew: boolean;
  onMarkSeen: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const prefersReduced = useReducedMotion();
  const Icon = concept.icon;

  const handleExpand = useCallback(() => {
    setExpanded(true);
    onMarkSeen(concept.id);
  }, [concept.id, onMarkSeen]);

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          "rounded-2xl border-l-4 overflow-hidden transition-shadow",
          expanded ? "shadow-md" : "hover:shadow-md",
        )}
        style={{ borderLeftColor: concept.color }}
      >
        <CardContent className="p-0">
          {/* Collapsed header -- always visible */}
          <button
            type="button"
            onClick={handleExpand}
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${concept.color}1F` }}
            >
              <Icon className="size-5" style={{ color: concept.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  {concept.title}
                </h4>
                {isNew && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    <Lightbulb className="size-2.5" />
                    New
                  </span>
                )}
                {!isNew && (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                )}
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {concept.analogy}
              </p>
            </div>
            <ArrowRight
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </button>

          {/* Expanded explanation */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/50 px-4 pb-4 pt-3">
                  <div className="flex items-start gap-3">
                    <Image
                      src="/images/chip.png"
                      alt="Chip"
                      width={32}
                      height={32}
                      className="size-8 shrink-0 drop-shadow-sm"
                    />
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-primary/5 border border-primary/15 px-3 py-2">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {concept.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ConceptIntro Component
// ---------------------------------------------------------------------------

interface ConceptIntroProps {
  /** IDs of concepts relevant to this lesson */
  conceptIds: string[];
}

export function ConceptIntro({ conceptIds }: ConceptIntroProps) {
  const { conceptsSeen, markConceptSeen } = useTutorialProgress();

  // Filter to concepts we have definitions for
  const concepts = useMemo(
    () =>
      conceptIds
        .map((id) => CONCEPT_LIBRARY.find((c) => c.id === id))
        .filter((c): c is ConceptDefinition => c !== null && c !== undefined),
    [conceptIds],
  );

  // Check which are new vs already seen
  const newConcepts = useMemo(
    () => concepts.filter((c) => !conceptsSeen.includes(c.id)),
    [concepts, conceptsSeen],
  );

  const handleMarkSeen = useCallback(
    (id: string) => {
      markConceptSeen(id);
    },
    [markConceptSeen],
  );

  // Don't render if no relevant concepts
  if (concepts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-5 text-amber-500" />
        <h3 className="text-base font-semibold text-foreground">
          {newConcepts.length > 0
            ? "New Concepts in This Lesson"
            : "Concepts You'll Use"}
        </h3>
      </div>

      <div className="space-y-2">
        {concepts.map((concept, index) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            index={index}
            isNew={!conceptsSeen.includes(concept.id)}
            onMarkSeen={handleMarkSeen}
          />
        ))}
      </div>
    </div>
  );
}
