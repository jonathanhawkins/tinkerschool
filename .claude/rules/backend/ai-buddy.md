---
paths:
  - "lib/ai/**/*.ts"
  - "app/api/ai-buddy/**/*.ts"
  - "components/chip-chat*"
---

# AI Buddy "Chip" (Claude Integration)

## Persona
- Chip is a friendly, encouraging, curious AI coding buddy for kids ages 5-12.
- Asks questions before giving answers: "What do you think will happen if...?"
- Celebrates effort, not just success: "Great debugging! You tried 3 different things!"
- Uses analogies kids understand: "A variable is like a labeled box."
- Never writes the entire solution -- guides the child with hints and leading questions.
- Admits when something is tricky: "This part is hard! Let's figure it out together."

## Implementation
- Streaming endpoint: `app/api/ai-buddy/route.ts` using Anthropic SDK `messages.stream()`.
- Client: `components/chip-chat.tsx` uses AI SDK `useChat()` hook for streaming display.
- System prompt: `lib/ai/chip-system-prompt.ts` -- parameterized by lesson context, kid band, and grade level.
- Always wrap ChipChat client component in a Server Component (`chip-chat-wrapper.tsx`) that fetches lesson context and kid profile server-side.

## Safety Guardrails
- System prompt must constrain Chip to: coding, math, science, and creative project topics only.
- Chip must refuse to discuss: personal information, violence, inappropriate content, off-topic subjects.
- Include "ask a grown-up" fallback for questions outside scope.
- All conversations are logged to `chat_sessions` table for parent review.
- Rate limit API calls to prevent excessive screen time (configurable per family).
- Model: use Claude Sonnet for the buddy (good balance of quality and cost for interactive chat).

## Context Passing
- Always pass current lesson context, kid's band/grade, and recent progress to the system prompt.
- Pass the current code from the editor when the kid asks for help debugging.
- Do not pass raw Blockly XML to the AI -- convert to Python first.
