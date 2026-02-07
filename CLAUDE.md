# TinkerSchool - Project Guide

## Project Overview

**TinkerSchool** is an open-source, AI-powered education platform that pairs kids (K-6) with an M5StickC Plus 2 device and a personalized AI tutor named "Chip" to learn all subjects -- math, reading, science, music, art, problem solving, and coding -- through hands-on, interactive projects. Primary user: Cassidy, age 7. Domain: tinkerschool.ai

Full PRD: `./docs/PRD.md` (TinkerSchool multi-subject PRD)

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| React | React + RSC | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui (Radix UI primitives) | latest |
| Animations | Framer Motion | 11.x |
| Block Editor | Google Blockly + react-blockly | 12.x / 7.x |
| Text Editor | Monaco Editor | 0.52.x |
| AI | Claude API (Anthropic SDK) + AI SDK -- Multi-subject personalized AI tutor | latest |
| Auth | Clerk (Organizations + metadata) | 6.x |
| Database | Supabase (PostgreSQL + RLS) | latest |
| Device Comms | Web Serial API (native) | Chrome 89+ |
| Terminal | xterm.js | 5.x |
| Firmware Flash | esptool-js | 0.5.x |
| Testing | Vitest + Playwright | latest |
| Hosting | Vercel | - |

## Architecture Principles

### React Server Components (RSC) First
- **Default to Server Components** -- every component is a Server Component unless it needs browser APIs or interactivity
- **Client boundaries are small islands** -- only `"use client"` for: Blockly editor, Monaco editor, xterm.js terminal, Web Serial device panel, Canvas simulator, AI chat (useChat), PIN login, Supabase realtime subscriptions
- **Data fetching in Server Components** -- use `async` components with direct Supabase queries, never `useEffect` for data loading
- **Streaming with Suspense** -- wrap slow-loading sections in `<Suspense>` boundaries for progressive rendering
- **Server Actions for mutations** -- `'use server'` functions for save, update, share operations; use `revalidatePath()` after mutations
- **Dynamic imports for browser-only libs** -- always use `dynamic(() => import(...), { ssr: false })` for Blockly, Monaco, xterm.js

### Component Classification
```
SERVER (0 JS shipped):
  - Page layouts, navigation, sidebar
  - Lesson content, story panels
  - Gallery grid (ISR with revalidate: 60)
  - Achievement board
  - Parent dashboard charts (pre-rendered SVG)
  - Curriculum browser

CLIENT ("use client"):
  - BlocklyEditor (DOM, canvas, onChange)
  - PythonEditor (Monaco)
  - DevicePanel (Web Serial API)
  - Terminal (xterm.js)
  - Simulator (Canvas 2D, requestAnimationFrame)
  - ChipChat (AI SDK useChat, streaming)
  - KidLogin (interactive PIN entry)
  - RealtimeProgress (Supabase WebSocket)

Note: Lesson viewer supports all subjects (not just coding).
```

## Project Structure

```
tinkerschool/
  app/
    (auth)/
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
    (dashboard)/
      layout.tsx                    # Dashboard shell
      page.tsx                      # Mission Control (home)
      workshop/
        page.tsx                    # Server Component - data fetching
        blockly-editor.tsx          # "use client" - Blockly
        python-editor.tsx           # "use client" - Monaco
        device-panel.tsx            # "use client" - Web Serial
        simulator-panel.tsx         # "use client" - Canvas
        chip-chat-wrapper.tsx       # Server Component - fetches context
        actions.ts                  # "use server" - save/update
      lessons/[lessonId]/
        page.tsx                    # Lesson view
        loading.tsx                 # Streaming skeleton
      gallery/page.tsx              # ISR static gallery
      achievements/page.tsx
      settings/page.tsx
    (parent)/
      dashboard/page.tsx
      dashboard/progress/page.tsx
      dashboard/ai-history/page.tsx
    api/
      ai-buddy/route.ts            # Claude streaming endpoint
      device/flash/route.ts
      webhooks/clerk/route.ts       # Clerk -> Supabase sync
    layout.tsx                      # Root layout (ClerkProvider)
    globals.css
  components/
    ui/                             # shadcn/ui components (Button, Dialog, Tabs, etc.)
    chip-chat.tsx                   # AI buddy chat client component
    device-status.tsx
    simulator.tsx
  lib/
    auth/
      require-auth.ts               # Server-side auth helper
    blocks/
      m5stick-blocks.ts             # Custom Blockly block definitions
      m5stick-toolbox.ts            # Toolbox categories
    codegen/
      wrap-m5stick.ts               # MicroPython boilerplate wrapper
    serial/
      web-serial.ts                 # WebSerialManager class
      micropython-repl.ts           # MicroPython REPL protocol
      flash-manager.ts              # esptool-js firmware flashing
      webrepl-client.ts             # WiFi WebREPL client
      connection-detector.ts        # Auto-detect USB vs WiFi
    supabase/
      client.ts                     # Browser client (Clerk JWT)
      server.ts                     # Server client (Clerk JWT)
      admin.ts                      # Admin client (service role)
      types.ts                      # Generated types -- includes multi-subject types (subjects, skills, learning_profiles, etc.)
    clerk/
      supabase-token.ts
    ai/
      chip-system-prompt.ts         # Chip persona & guardrails -- multi-subject aware
      code-review.ts
  middleware.ts                     # Clerk auth middleware
  supabase/
    migrations/                     # SQL migrations (multiple migrations including multi-subject schema)
    seed.sql                        # Curriculum seed data
  public/
    sounds/
    images/
```

## Key Patterns

### Data Fetching (Server Component)
```tsx
// Always fetch data in async Server Components
export default async function Page({ params }) {
  const { userId, profile, supabase } = await requireAuth();
  const { data } = await supabase.from('lessons').select('*').eq('id', id).single();
  return <LessonView lesson={data} />;
}
```

### Server Actions (Mutations)
```tsx
// app/(dashboard)/workshop/actions.ts
'use server';
export async function saveProject(formData: FormData) {
  const { userId } = await auth();
  // ... save to Supabase
  revalidatePath('/gallery');
}
```

### Dynamic Import (Browser-Only Libraries)
```tsx
const BlocklyEditor = dynamic(() => import('./blockly-editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
```

### Clerk Auth Helper
```tsx
// lib/auth/require-auth.ts
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('clerk_id', userId).single();
  if (!profile) redirect('/onboarding');
  return { userId, profile, supabase };
}
```

## Environment Variables

```bash
# .env.local
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## shadcn/ui Components

Components live in `components/ui/` and are added via CLI:
```bash
npx shadcn@latest add button dialog tabs tooltip progress avatar badge card input
```

Key components used in TinkerSchool:
- `Button` -- all actions (Flash, Save, Send, navigation). Customize with kid-friendly sizes/colors.
- `Dialog` -- confirmation modals (share project, reset device, delete project)
- `Tabs` -- Blocks/Python toggle in workshop, lesson tabs
- `Tooltip` -- hover hints on Blockly toolbox categories, device status
- `Progress` -- lesson completion, flash progress bar, achievement progress
- `Avatar` -- kid profile selector on login screen
- `Badge` -- achievement badges, device connection status indicator
- `Card` -- lesson cards, project gallery cards, mission control cards
- `Input` -- PIN entry, search, AI chat input
- `Skeleton` -- loading states (already built into shadcn)

Use the `cn()` utility from `lib/utils.ts` (clsx + tailwind-merge) for conditional class merging.

CSS variables for theming are in `app/globals.css`. Override shadcn defaults with TinkerSchool's kid-friendly palette.

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm run test              # Vitest unit tests
npm run test:e2e          # Playwright E2E tests

# Lint & format
npm run lint
npm run format

# Database
npx supabase db push      # Apply migrations
npx supabase db reset     # Reset + reseed

# Type generation
npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
```

## M5StickC Plus 2 Device Details

- **Chip:** ESP32-PICO-V3-02
- **Display:** 1.14" TFT (135x240), ST7789V2 driver
- **USB Chip:** CH9102 (vendor: 0x1A86, products: 0x55D4 / 0x55D3)
- **Baud Rate:** 115200
- **Sensors:** 6-axis IMU (MPU6886), microphone, IR transmitter
- **I/O:** 2 buttons (A/B), buzzer, LED, GPIO via HAT connector
- **Battery:** 200mAh rechargeable
- **Programming:** MicroPython (primary), UIFlow2, Arduino

### Device Communication Modes
1. **USB Serial REPL** (primary) -- Web Serial API, push .py files via raw REPL paste mode (~1s)
2. **USB Firmware Flash** -- esptool-js for full MicroPython firmware updates (~30s)
3. **WiFi WebREPL** -- WebSocket-based file push over local network (~2s)
4. **WiFi OTA** -- Over-the-air firmware updates via HTTP (~45s)

### MicroPython REPL Control Characters
```
Ctrl-A (0x01) = Enter raw REPL mode
Ctrl-B (0x02) = Exit raw REPL mode (back to normal)
Ctrl-C (0x03) = Interrupt running program
Ctrl-D (0x04) = Soft reset / execute in raw mode
Ctrl-E (0x05) = Enter paste mode
```

## Custom Blockly Blocks

All custom blocks are in `lib/blocks/m5stick-blocks.ts`. Each block needs:
1. A `Blockly.Blocks['block_name']` definition (UI/shape)
2. A `pythonGenerator.forBlock['block_name']` function (code output)

Block categories: M5Stick Display, M5Stick Buzzer, M5Stick Sensors, Logic, Loops, Math, Variables

Generated Python is wrapped with M5Stick boilerplate via `lib/codegen/wrap-m5stick.ts` before flashing.

## Database Schema (Supabase)

Core tables: `families`, `profiles`, `subjects`, `skills`, `modules`, `lessons`, `projects`, `progress`, `badges`, `user_badges`, `chat_sessions`, `device_sessions`, `learning_profiles`, `skill_proficiency`, `artifacts`, `artifact_ratings`

RLS policies scope data by family -- kids see their own data, parents see all family data, curriculum tables are publicly readable.

## Auth Model

- **Parent:** Real Clerk user (email + password or OAuth), role `org:admin`
- **Kid:** Managed profile under parent's Clerk Organization, PIN-based login (4 digits), no email required
- **Family:** Clerk Organization grouping parent + kid profiles
- Kid metadata stored in Clerk `publicMetadata` (displayName, avatarId, gradeLevel, currentBand)

## AI Buddy "Chip" Guidelines

- Target audience: 5-12 year olds
- Never gives complete solutions -- guides through leading questions
- Uses kid-friendly analogies
- Celebrates effort over results
- Stays on-topic: all school subjects (math, reading, science, music, art, problem solving, coding), creative projects, and general knowledge appropriate for kids
- Adapts to each child's learning profile (learning style, interests, skill levels)
- Connects concepts across subjects when relevant
- Rate-limited to prevent excessive screen time
- All conversations logged for parent review
- Model: Claude Sonnet via streaming API route

## Curriculum Bands

| Band | Name | Grades | Ages | Programming Mode |
|---|---|---|---|---|
| 1 | Explorer | K-1 | 5-6 | UIFlow2 blocks (templates) |
| 2 | Builder | 2-3 | 7-8 | Blocks + "peek at Python" |
| 3 | Inventor | 3-4 | 8-9 | MicroPython + block hints |
| 4 | Hacker | 4-5 | 9-10 | MicroPython + vibe coding |
| 5 | Creator | 5-6 | 10-12 | Full MicroPython + AI |

Cassidy starts at **Band 2 (Builder)**.

TinkerSchool extends beyond coding. Each band includes all subjects (Math, Reading, Science, Music, Art, Problem Solving, Coding) at age-appropriate levels.

## Browser Requirements

- **Chrome 89+** or **Edge 89+** required (Web Serial API)
- Firefox/Safari: simulator-only mode (no device connection)
- Falls back gracefully with clear messaging

## Important Notes

- Always test device communication with the actual M5StickC Plus 2 hardware
- The Web Serial API requires user gesture (click) to initiate port selection
- Blockly, Monaco, and xterm.js must NEVER be imported at the top level in Server Components -- always use `dynamic()` with `ssr: false`
- Keep client component bundles small; the workshop page is the heaviest at ~985KB (route-split, loaded on demand)
- Non-workshop pages should ship ~45KB JS or less
- Supabase RLS policies are the security boundary -- always verify they work for both parent and kid roles
- Clerk webhook must be configured to sync user creation to Supabase profiles table
