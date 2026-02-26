// ---------------------------------------------------------------------------
// Parent Co-Play Prompts - Contextual suggestions for Pre-K parents
// ---------------------------------------------------------------------------
// Maps activity types to helpful parent prompts that encourage engagement
// and co-play during Pre-K sessions. These are shown in the ParentPromptBar.
// ---------------------------------------------------------------------------

import type { ActivityContent } from "./types";

/** Maps activity type to an array of parent prompt suggestions. */
const PROMPTS_BY_TYPE: Record<string, string[]> = {
  counting: [
    "Count out loud together!",
    "Try asking: 'Can you show me that many fingers?'",
    "Say each number as your child taps!",
    "Try counting backwards together after!",
  ],
  multiple_choice: [
    "Read the question out loud together!",
    "Try asking: 'Why did you pick that one?'",
    "Talk about each answer choice together!",
    "Celebrate when they get it right!",
  ],
  matching_pairs: [
    "Help them remember where the cards are!",
    "Say the name of each picture when it flips!",
    "Try asking: 'Which ones look the same?'",
    "Cheer when they find a match!",
  ],
  sequence_order: [
    "Talk through the order together!",
    "Try asking: 'Which one comes first?'",
    "Act out the sequence together!",
    "Say each step out loud!",
  ],
  flash_card: [
    "Read the card out loud together!",
    "Try asking: 'Can you tell me about this?'",
    "Make up a silly sentence about the card!",
    "Connect the card to something they know!",
  ],
  number_bond: [
    "Use your fingers to show the parts!",
    "Try asking: 'How many more do we need?'",
    "Break apart real objects to show the bond!",
  ],
  ten_frame: [
    "Count the dots together!",
    "Try asking: 'How many empty spots are left?'",
    "Use real objects to build a ten frame!",
  ],
  number_line: [
    "Count the jumps together!",
    "Try asking: 'Which number comes next?'",
    "Walk along an imaginary number line!",
  ],
  emotion_picker: [
    "Make the face together!",
    "Try asking: 'When do you feel like that?'",
    "Talk about what makes them feel each emotion!",
  ],
  drag_to_sort: [
    "Talk about why things go in each group!",
    "Try asking: 'Which one is bigger?'",
    "Sort real objects at home the same way!",
  ],
  listen_and_find: [
    "Listen carefully together!",
    "Try asking: 'What sound do you hear?'",
    "Make the sounds together!",
  ],
  tap_and_reveal: [
    "Guess what might be hidden!",
    "Try asking: 'What do you think is under there?'",
    "Take turns tapping!",
  ],
  trace_shape: [
    "Trace the shape in the air together!",
    "Try asking: 'Where else do you see this shape?'",
    "Find the shape around your home!",
  ],
  rekenrek: [
    "Slide the beads together!",
    "Try asking: 'How many red beads do you see?'",
    "Count each bead as it moves!",
  ],
  parent_activity: [
    "This is your turn to play together!",
    "Follow the activity instructions with your child!",
  ],
};

/** Default prompts used when no type-specific prompt is available. */
const DEFAULT_PROMPTS = [
  "Play along together!",
  "Talk about what you see on screen!",
  "Encourage them to explain their thinking!",
];

/**
 * Get a contextual parent co-play prompt for the given activity.
 *
 * @param activity - The current activity content
 * @param questionIndex - Current question index (used to rotate prompts)
 * @returns A parent-facing suggestion string
 */
export function getParentPrompt(
  activity: ActivityContent,
  questionIndex: number,
): string {
  const prompts = PROMPTS_BY_TYPE[activity.type] ?? DEFAULT_PROMPTS;
  const index = Math.abs(questionIndex) % prompts.length;
  return prompts[index];
}
