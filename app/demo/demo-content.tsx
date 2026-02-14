"use client";

import { Calculator, BookOpen, FlaskConical } from "lucide-react";

import type { DemoSubjectConfig } from "./demo-lesson";
import { DemoLesson } from "./demo-lesson";

// ---------------------------------------------------------------------------
// Demo activity configs for 3 subjects
// Defined inside a client component so icon components can be passed directly.
// ---------------------------------------------------------------------------

const DEMO_SUBJECTS: DemoSubjectConfig[] = [
  {
    id: "math",
    name: "Math",
    icon: Calculator,
    color: "#3B82F6",
    emoji: "\uD83E\uDDEE",
    chipIntro:
      "Hi there! I'm Chip, your learning buddy! Let's play with some numbers together. I'll start you with a few fun math puzzles -- tap, count, and sort your way through!",
    chipEncouragement: "You're a math superstar!",
    config: {
      activities: [
        {
          type: "counting" as const,
          questions: [
            {
              id: "demo-count-1",
              prompt: "How many stars do you see?",
              emoji: "\u2B50",
              correctCount: 5,
              displayCount: 5,
              hint: "Point to each star and count out loud!",
            },
            {
              id: "demo-count-2",
              prompt: "Count the apples!",
              emoji: "\uD83C\uDF4E",
              correctCount: 3,
              displayCount: 3,
              hint: "Tap each apple to count it!",
            },
          ],
        },
        {
          type: "multiple_choice" as const,
          questions: [
            {
              id: "demo-mc-1",
              prompt: "What is 3 + 2?",
              promptEmoji: "\uD83E\uDDEE",
              options: [
                { id: "a", text: "4", emoji: "4\uFE0F\u20E3" },
                { id: "b", text: "5", emoji: "5\uFE0F\u20E3" },
                { id: "c", text: "6", emoji: "6\uFE0F\u20E3" },
              ],
              correctOptionId: "b",
              hint: "Count on your fingers: start at 3 and count 2 more!",
            },
            {
              id: "demo-mc-2",
              prompt: "Which shape has 3 sides?",
              promptEmoji: "\uD83D\uDCD0",
              options: [
                { id: "a", text: "Circle", emoji: "\u2B55" },
                { id: "b", text: "Square", emoji: "\u2B1C" },
                { id: "c", text: "Triangle", emoji: "\uD83D\uDD3A" },
              ],
              correctOptionId: "c",
              hint: "Tri means three!",
            },
          ],
          shuffleOptions: true,
        },
        {
          type: "sequence_order" as const,
          questions: [
            {
              id: "demo-seq-1",
              prompt: "Put these numbers in order from smallest to biggest!",
              items: [
                {
                  id: "s1",
                  text: "3",
                  emoji: "3\uFE0F\u20E3",
                  correctPosition: 2,
                },
                {
                  id: "s2",
                  text: "1",
                  emoji: "1\uFE0F\u20E3",
                  correctPosition: 1,
                },
                {
                  id: "s3",
                  text: "5",
                  emoji: "5\uFE0F\u20E3",
                  correctPosition: 3,
                },
              ],
              hint: "Which number is the smallest? That goes first!",
            },
          ],
        },
      ],
      passingScore: 50,
      estimatedMinutes: 3,
    },
  },
  {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    color: "#22C55E",
    emoji: "\uD83D\uDCD6",
    chipIntro:
      "Time for a word adventure! Let's match some letters and sounds together. Reading is like a treasure hunt -- every word is a clue!",
    chipEncouragement: "You're becoming a word wizard!",
    config: {
      activities: [
        {
          type: "matching_pairs" as const,
          prompt: "Match each letter to its sound!",
          pairs: [
            {
              id: "lp1",
              left: { id: "l1", text: "B", emoji: "\uD83C\uDD71\uFE0F" },
              right: { id: "r1", text: "buh", emoji: "\uD83D\uDCAC" },
            },
            {
              id: "lp2",
              left: { id: "l2", text: "S", emoji: "\uD83C\uDD7E\uFE0F" },
              right: { id: "r2", text: "sss", emoji: "\uD83D\uDC0D" },
            },
            {
              id: "lp3",
              left: { id: "l3", text: "M", emoji: "\u24C2\uFE0F" },
              right: { id: "r3", text: "mmm", emoji: "\uD83E\uDD24" },
            },
          ],
          hint: "Say each letter sound out loud to find the match!",
        },
        {
          type: "multiple_choice" as const,
          questions: [
            {
              id: "demo-read-mc-1",
              prompt: "Which word starts with the same sound as 'Cat'?",
              promptEmoji: "\uD83D\uDC31",
              options: [
                { id: "a", text: "Dog", emoji: "\uD83D\uDC36" },
                { id: "b", text: "Cup", emoji: "\u2615" },
                { id: "c", text: "Ball", emoji: "\u26BD" },
              ],
              correctOptionId: "b",
              hint: "Say 'Cat' and 'Cup' -- do they start the same way?",
            },
            {
              id: "demo-read-mc-2",
              prompt: "Which word rhymes with 'Hat'?",
              promptEmoji: "\uD83C\uDFA9",
              options: [
                { id: "a", text: "Bat", emoji: "\uD83E\uDD87" },
                { id: "b", text: "Dog", emoji: "\uD83D\uDC36" },
                { id: "c", text: "Sun", emoji: "\u2600\uFE0F" },
              ],
              correctOptionId: "a",
              hint: "Rhyming words end with the same sound!",
            },
          ],
          shuffleOptions: true,
        },
        {
          type: "sequence_order" as const,
          questions: [
            {
              id: "demo-read-seq-1",
              prompt: "Put these letters in ABC order!",
              items: [
                {
                  id: "rs1",
                  text: "C",
                  emoji: "\uD83C\uDD72",
                  correctPosition: 3,
                },
                {
                  id: "rs2",
                  text: "A",
                  emoji: "\uD83C\uDD70\uFE0F",
                  correctPosition: 1,
                },
                {
                  id: "rs3",
                  text: "B",
                  emoji: "\uD83C\uDD71\uFE0F",
                  correctPosition: 2,
                },
              ],
              hint: "Sing the ABC song! Which letter comes first?",
            },
          ],
        },
      ],
      passingScore: 50,
      estimatedMinutes: 3,
    },
  },
  {
    id: "science",
    name: "Science",
    icon: FlaskConical,
    color: "#F97316",
    emoji: "\uD83D\uDD2C",
    chipIntro:
      "Let's explore the world like real scientists! We'll sort animals, discover which things float, and learn about the amazing world around us!",
    chipEncouragement: "What a great little scientist you are!",
    config: {
      activities: [
        {
          type: "multiple_choice" as const,
          questions: [
            {
              id: "demo-sci-mc-1",
              prompt: "Which animal lives in water?",
              promptEmoji: "\uD83C\uDF0A",
              options: [
                { id: "a", text: "Cat", emoji: "\uD83D\uDC31" },
                { id: "b", text: "Fish", emoji: "\uD83D\uDC1F" },
                { id: "c", text: "Bird", emoji: "\uD83D\uDC26" },
              ],
              correctOptionId: "b",
              hint: "Think about where you see this animal swimming!",
            },
            {
              id: "demo-sci-mc-2",
              prompt: "What do plants need to grow?",
              promptEmoji: "\uD83C\uDF31",
              options: [
                {
                  id: "a",
                  text: "Sunlight and water",
                  emoji: "\u2600\uFE0F",
                },
                { id: "b", text: "Candy", emoji: "\uD83C\uDF6C" },
                { id: "c", text: "Ice cream", emoji: "\uD83C\uDF68" },
              ],
              correctOptionId: "a",
              hint: "Think about what happens when you water flowers in the sun!",
            },
          ],
          shuffleOptions: true,
        },
        {
          type: "matching_pairs" as const,
          prompt: "Match each baby animal to its parent!",
          pairs: [
            {
              id: "sp1",
              left: { id: "sl1", text: "Kitten", emoji: "\uD83D\uDC31" },
              right: { id: "sr1", text: "Cat", emoji: "\uD83D\uDC08" },
            },
            {
              id: "sp2",
              left: { id: "sl2", text: "Puppy", emoji: "\uD83D\uDC36" },
              right: { id: "sr2", text: "Dog", emoji: "\uD83D\uDC15" },
            },
            {
              id: "sp3",
              left: { id: "sl3", text: "Chick", emoji: "\uD83D\uDC25" },
              right: { id: "sr3", text: "Hen", emoji: "\uD83D\uDC14" },
            },
          ],
          hint: "Think about which baby grows up to be which animal!",
        },
        {
          type: "counting" as const,
          questions: [
            {
              id: "demo-sci-count-1",
              prompt: "How many legs does a butterfly have?",
              emoji: "\uD83E\uDD8B",
              correctCount: 6,
              displayCount: 6,
              hint: "All insects have 6 legs! Count them carefully.",
            },
          ],
        },
      ],
      passingScore: 50,
      estimatedMinutes: 3,
    },
  },
];

// ---------------------------------------------------------------------------
// Exported wrapper
// ---------------------------------------------------------------------------

export function DemoContent() {
  return <DemoLesson subjects={DEMO_SUBJECTS} />;
}
