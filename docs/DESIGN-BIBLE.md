# TinkerSchool.ai Design Bible

> The definitive design reference for TinkerSchool.ai -- an open-source, AI-powered
> education platform for K-6 kids. Every color, font, spacing decision, and component
> pattern lives here.

**Last updated:** 2026-02-07
**Primary user:** Cassidy, age 7 (1st grade)
**Tech stack:** Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, Framer Motion 12

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Patterns](#5-component-patterns)
6. [Illustration & Iconography](#6-illustration--iconography)
7. [Animation & Motion](#7-animation--motion)
8. [Landing Page Blueprint](#8-landing-page-blueprint)
9. [Accessibility](#9-accessibility)
10. [Industry Design Principles](#10-industry-design-principles)

---

## 1. Brand Identity

### Brand Personality

TinkerSchool is the encouraging science teacher who kneels down to a kid's eye level,
hands them a magnifying glass, and says "What do you see?" It is never condescending,
never boring, never complicated. It is warm, curious, and grounded.

**Five personality traits:**

| Trait | What it means | What it is NOT |
|---|---|---|
| **Curious** | We ask questions, celebrate wonder | Not preachy or lecture-like |
| **Hands-on** | Physical, tangible, real | Not abstract or screen-only |
| **Encouraging** | Celebrates effort, guides gently | Not competitive or grade-obsessed |
| **Playful** | Fun colors, friendly voice, surprises | Not chaotic, noisy, or overstimulating |
| **Trustworthy** | Open source, transparent, safe | Not corporate, data-harvesting, or paywalled |

### Brand Voice

- **To kids:** Conversational, short sentences, exclamation marks welcome. "You did it!"
  not "Congratulations on your achievement." Use "you" and "we" freely.
- **To parents:** Clear, confident, no jargon. Straightforward about what TinkerSchool
  does and why. Data-informed but not data-heavy. Warm professionalism.
- **Technical docs:** Precise, well-structured, no fluff. Assume competence.

### Logo Usage

The TinkerSchool wordmark combines the name with a lightbulb motif that represents
the "aha moment" of discovery. The bulb references both ideas (learning) and
electricity (hardware/the M5StickC device).

**Logo mark:** A stylized lightbulb rendered with rounded geometric shapes. The filament
forms a subtle "T" shape. Uses the primary purple color.

**Logo rules:**
- Minimum clear space: 1x the height of the bulb on all sides
- Minimum size: 32px height for digital, 12mm for print
- Never distort, rotate, or recolor with non-brand colors
- On dark backgrounds, use the white/light variant
- The icon can be used standalone (favicon, app icon, avatar)

### Tagline Options

| Tagline | Context |
|---|---|
| **"Where every kid is a genius waiting to bloom"** | Hero headline, primary |
| **"The classroom in your hand"** | Hardware-focused contexts, device pages |
| **"Learn everything with Chip"** | Kid-facing, app dashboard |
| **"Open-source education for everyone"** | Footer, open-source community |
| **"AI + Hardware + Curiosity"** | Technical/parent contexts |

---

## 2. Color System

### Design Philosophy

TinkerSchool uses a **purple-forward brand palette** inspired by creativity, imagination,
and Cassidy's favorite color. Subject colors provide a rainbow spectrum that makes each
discipline feel distinct while belonging to the same family. The palette is bold without
being garish -- following research showing K-6 kids respond best to saturated,
high-contrast colors rather than pastels.

### Primary Brand Colors

| Name | Hex | HSL | OKLCH | Usage |
|---|---|---|---|---|
| **TinkerPurple** (Primary) | `#7C3AED` | `263 84% 58%` | `oklch(0.53 0.22 290)` | Buttons, links, brand accents, active states |
| **TinkerPurple Light** | `#EDE9FE` | `263 90% 95%` | `oklch(0.96 0.02 290)` | Backgrounds, hover states, subtle tints |
| **TinkerPurple Dark** | `#3B1A8B` | `263 68% 32%` | `oklch(0.33 0.18 290)` | Text on light bg, dark mode accents |

### Secondary Brand Colors

| Name | Hex | HSL | Usage |
|---|---|---|---|
| **CoralPink** (Secondary) | `#F472B6` | `330 86% 70%` | Secondary CTAs, highlights, kid-facing accents |
| **SunshineYellow** | `#FBBF24` | `43 96% 56%` | Celebrations, stars, achievements, warnings |
| **MintGreen** | `#34D399` | `160 64% 52%` | Success states, completion, positive feedback |

### Neutral Palette

| Name | Hex | OKLCH | Usage |
|---|---|---|---|
| **Ink** | `#1E1B4B` | `oklch(0.27 0.03 290)` | Primary text (has purple undertone) |
| **Slate** | `#64748B` | `oklch(0.5 0.03 250)` | Secondary text, descriptions |
| **Mist** | `#F8FAFC` | `oklch(0.97 0.005 290)` | Page backgrounds, subtle sections |
| **Cloud** | `#E2E8F0` | `oklch(0.92 0.01 290)` | Borders, dividers, input outlines |
| **White** | `#FFFFFF` | `oklch(1 0 0)` | Cards, content areas |

### Subject Colors

Each of the 7 subjects has a dedicated color. These are used for subject cards, progress
indicators, lesson badges, and category navigation. Each color is chosen for
distinctiveness, kid appeal, and WCAG AA contrast against white.

| Subject | Hex | Tailwind Variable | Meaning/Association |
|---|---|---|---|
| **Math** | `#3B82F6` | `--subject-math` | Blue -- logic, structure, sky |
| **Reading** | `#22C55E` | `--subject-reading` | Green -- growth, nature, stories |
| **Science** | `#F97316` | `--subject-science` | Orange -- energy, experiments, fire |
| **Music** | `#A855F7` | `--subject-music` | Purple -- creativity, harmony |
| **Art** | `#EC4899` | `--subject-art` | Pink -- expression, beauty |
| **Problem Solving** | `#EAB308` | `--subject-problem-solving` | Yellow -- thinking, lightbulb |
| **Coding** | `#14B8A6` | `--subject-coding` | Teal -- technology, terminals |

**Subject color tints:** Each subject color generates a tinted background at 8% opacity
(`${color}14`) for card backgrounds and 12% opacity (`${color}1F`) for icon containers.

### Semantic Colors

| Semantic | Hex | Usage |
|---|---|---|
| **Success** | `#22C55E` | Completed lessons, correct answers, saved successfully |
| **Warning** | `#EAB308` | In-progress items, time reminders, attention needed |
| **Error** | `#EF4444` | Soft red for errors (not alarming -- softened with `oklch(0.58 0.2 25)`) |
| **Info** | `#3B82F6` | Tooltips, informational badges, device status |

### Chart Colors (Data Visualization)

| Chart | Hex | Variable |
|---|---|---|
| Chart 1 | `#7C3AED` | `--chart-1` (primary purple) |
| Chart 2 | `#F472B6` | `--chart-2` (coral pink) |
| Chart 3 | `#34D399` | `--chart-3` (mint green) |
| Chart 4 | `#FBBF24` | `--chart-4` (sunshine yellow) |
| Chart 5 | `#3B82F6` | `--chart-5` (blue) |

### Dark Mode

Dark mode is for the parent dashboard and settings -- kids primarily use light mode.
The dark theme uses neutral grays (not purple-tinted) for reduced eye strain.

| Variable | Light | Dark |
|---|---|---|
| `--background` | `#FFFFFF` | `#0F172A` |
| `--foreground` | `#1E1B4B` | `#F8FAFC` |
| `--card` | `#FFFFFF` | `#1E293B` |
| `--primary` | `#7C3AED` | `#A78BFA` (lighter for contrast) |
| `--muted` | `#F8FAFC` | `#334155` |
| `--border` | `#E2E8F0` | `rgba(255,255,255,0.1)` |

### Tailwind CSS 4 Definitions

All colors are defined as CSS custom properties in `app/globals.css` using the
`@theme inline` block and `:root` / `.dark` selectors. Subject colors use hex
values directly for easy use in inline styles.

```css
@theme inline {
  --color-subject-math: var(--subject-math);
  --color-subject-reading: var(--subject-reading);
  --color-subject-science: var(--subject-science);
  --color-subject-music: var(--subject-music);
  --color-subject-art: var(--subject-art);
  --color-subject-problem-solving: var(--subject-problem-solving);
  --color-subject-coding: var(--subject-coding);
}

:root {
  --subject-math: #3B82F6;
  --subject-reading: #22C55E;
  --subject-science: #F97316;
  --subject-music: #A855F7;
  --subject-art: #EC4899;
  --subject-problem-solving: #EAB308;
  --subject-coding: #14B8A6;
}
```

Usage in Tailwind classes: `bg-subject-math`, `text-subject-reading`, etc.

---

## 3. Typography

### Design Philosophy

Typography for a K-6 education platform must balance readability for developing readers
with visual personality. Research shows sans-serif fonts with generous x-heights and
single-story `a` letterforms are easiest for children to read. We pair a clean geometric
sans-serif (Nunito) with a monospace variant for code.

### Font Stack

| Role | Font | Fallback | Variable |
|---|---|---|---|
| **Headings & Body** | Nunito | `system-ui, -apple-system, sans-serif` | `--font-nunito` |
| **Code & Terminal** | Geist Mono | `ui-monospace, 'Cascadia Code', monospace` | `--font-geist-mono` |

**Why Nunito:**
- Rounded sans-serif with soft terminals, widely used in kids' education platforms
- Excellent x-height ratio for developing readers
- Warm, friendly personality that matches the TinkerSchool brand
- Variable font with full weight range (200-900) via Google Fonts
- Single-story `a` letterform aids reading comprehension for young learners

### Type Scale

The type scale uses a consistent rhythm. Sizes are defined in Tailwind utility classes.

| Level | Class | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Display** | `text-4xl sm:text-5xl md:text-6xl` | 36/48/60px | `font-bold` (700) | `leading-tight` (1.1) | Landing page hero only |
| **H1** | `text-2xl` | 24px | `font-bold` (700) | `leading-tight` (1.2) | Page titles ("Welcome back, Cassidy!") |
| **H2** | `text-lg sm:text-xl` | 18/20px | `font-semibold` (600) | `leading-snug` (1.3) | Section titles ("Your Missions") |
| **H3** | `text-base` | 16px | `font-semibold` (600) | `leading-normal` (1.5) | Card titles, module names |
| **Body** | `text-sm sm:text-base` | 14/16px | `font-normal` (400) | `leading-relaxed` (1.6) | Descriptions, lesson text |
| **Caption** | `text-xs` | 12px | `font-medium` (500) | `leading-normal` (1.5) | Metadata, timestamps, progress labels |
| **Code** | `text-sm font-mono` | 14px | `font-normal` (400) | `leading-relaxed` (1.6) | Code blocks, terminal output |

### Font Weight Usage

| Weight | Class | When to use |
|---|---|---|
| 400 (Regular) | `font-normal` | Body text, descriptions, long-form content |
| 500 (Medium) | `font-medium` | Labels, captions, badge text, navigation items |
| 600 (Semibold) | `font-semibold` | Section headings, card titles, important labels |
| 700 (Bold) | `font-bold` | Page titles, hero text, strong emphasis only |

**Rule:** Never use `font-extrabold` or `font-black` -- they feel aggressive, not
playful. Reserve bold for the single most important element on screen.

### Kid-Specific Typography Rules

1. **Minimum body text size: 14px** (`text-sm`). Never go below 12px (`text-xs`) except
   for metadata that parents read.
2. **Generous line height:** Use `leading-relaxed` (1.625) for body text. Dense line
   heights make text feel intimidating to developing readers.
3. **Short lines:** Max `max-w-xl` (576px) for body text blocks. Long lines cause
   re-reading errors in young readers.
4. **Left-aligned text** for reading content. Center-aligned only for hero headlines and
   short labels.
5. **High contrast:** Body text uses `text-foreground` (#1E1B4B) on white, providing
   a contrast ratio of 14.5:1 (well above WCAG AAA 7:1).

---

## 4. Spacing & Layout

### Spacing Scale

TinkerSchool uses Tailwind's default spacing scale. The key values used throughout:

| Token | Pixels | Usage |
|---|---|---|
| `gap-1` / `p-1` | 4px | Tight icon-to-text spacing |
| `gap-1.5` / `p-1.5` | 6px | Badge padding, tiny margins |
| `gap-2` / `p-2` | 8px | Form element spacing, compact lists |
| `gap-3` / `p-3` | 12px | Card section gaps, medium spacing |
| `gap-4` / `p-4` | 16px | Standard component internal spacing |
| `gap-6` / `p-6` | 24px | Card padding, section content spacing |
| `gap-8` / `p-8` | 32px | Between major page sections |
| `gap-10` / `py-10` | 40px | Landing page section spacing |
| `py-20` | 80px | Landing page section vertical padding |
| `py-24` | 96px | Hero section vertical padding |

### Grid System

| Context | Pattern | Breakpoint behavior |
|---|---|---|
| **Subject cards** | `grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | 1 -> 2 -> 3 -> 4 columns |
| **Module cards** | `grid gap-6 sm:grid-cols-2 xl:grid-cols-3` | 1 -> 2 -> 3 columns |
| **Feature cards** | `grid gap-6 md:grid-cols-3` | 1 -> 3 columns |
| **Dashboard layout** | Sidebar (280px) + main content area | Collapsible on mobile |

### Container Widths

| Context | Class | Width |
|---|---|---|
| **Landing page content** | `max-w-5xl mx-auto` | 1024px |
| **Dashboard main area** | Full width within sidebar layout | Fluid |
| **Body text blocks** | `max-w-xl` | 576px |
| **Hero tagline** | `max-w-2xl` | 672px |
| **Dialog content** | `max-w-md` or `max-w-lg` | 448px / 512px |

### Breakpoints

Using Tailwind's default breakpoints:

| Breakpoint | Min Width | Context |
|---|---|---|
| `sm` | 640px | 2-column grids, larger text |
| `md` | 768px | 3-column grids, tablet layout |
| `lg` | 1024px | Sidebar visible, 3-4 column grids |
| `xl` | 1280px | Full 4-column grids, max content width |

### Border Radius

Kid-friendly interfaces use generous rounding. TinkerSchool uses a base radius of
`1rem` (16px), producing the following scale:

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 12px | Small pills, inline badges |
| `rounded-md` | 14px | Buttons, inputs, small interactive elements |
| `rounded-lg` | 16px | Default for most components |
| `rounded-xl` | 20px | Cards, modals, larger containers |
| `rounded-2xl` | 24px | Feature cards, hero elements |
| `rounded-3xl` | 28px | Special highlight cards |
| `rounded-full` | 9999px | Avatars, pill buttons, circular elements |

### Card Pattern

The standard card template used across the dashboard:

```
Card (rounded-2xl, border, shadow-sm)
  |-- CardHeader (optional -- for titled cards)
  |   |-- CardTitle (text-base font-semibold)
  |   |-- CardDescription (text-xs text-muted-foreground)
  |-- CardContent (p-5 or p-6)
  |-- CardFooter (optional -- for progress bars, actions)
```

Subject-specific cards add a `border-l-4` with the subject color and a tinted background.

---

## 5. Component Patterns

### Buttons

TinkerSchool buttons use shadcn/ui `Button` with customizations for kid-friendliness.

| Variant | Usage | Style |
|---|---|---|
| **Default (Primary)** | Main actions: "Start Lesson", "Continue", "Flash Device" | Purple bg, white text, rounded-xl |
| **Secondary** | Important secondary: "Open Workshop" | Pink bg or outlined, rounded-xl |
| **Outline** | Tertiary actions: "View All", "Browse Subjects" | Border, transparent bg, rounded-xl |
| **Ghost** | Minimal actions: navigation links, "View all" | No border, hover bg only |
| **Destructive** | Danger: "Reset Device", "Delete Project" | Soft red, rounded-xl |

**Button sizes for kid interfaces:**
- `size="lg"` with `rounded-xl` for primary CTAs (minimum 44px touch target)
- `size="default"` for standard actions
- `size="sm"` for compact/toolbar actions

**Button animation pattern (Framer Motion):**
```tsx
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
  <Button>Start Lesson</Button>
</motion.div>
```

### Cards

**Lesson Card:**
```
rounded-2xl, border-l-4 with subject color
Icon circle (size-12, rounded-xl, tinted bg)
Title (text-base font-semibold)
Description (text-xs text-muted-foreground)
Progress bar (h-1.5, rounded-full, subject-colored fill)
```

**Achievement Card:**
```
rounded-xl, p-3, centered layout
Badge icon (size-12, rounded-full, bg-primary/10)
Badge name (text-xs font-medium)
```

**Subject Card:**
```
rounded-2xl, border-l-4 with subject color
bg: subject color at 8% opacity
Icon container (size-12, rounded-xl, subject color at 12%)
Subject name (font-semibold, subject color)
Progress (skills mastered / total)
Arrow indicator on hover
```

**Module Card:**
```
rounded-2xl, border-l-4 with subject color
Module icon + title + description header
Lesson list (rows with status badges)
Footer with progress bar and fraction
Locked variant: opacity-60, Lock icon, "Complete previous module"
```

### Navigation

**Dashboard sidebar (desktop):**
- 280px fixed width, collapsible
- Logo at top
- Navigation items with icons
- Active state: `bg-sidebar-accent` with `text-sidebar-primary`
- Kid avatar and name at bottom

**Dashboard header (mobile):**
- Hamburger menu trigger
- Logo centered
- Profile avatar on right

**Landing page nav:**
- Transparent, overlays hero
- Logo on left, "Sign In" / "Get Started" buttons on right
- Sticky on scroll with `bg-background/80 backdrop-blur-sm`

### Status Badges

| Status | Style |
|---|---|
| **Completed** | `bg-emerald-600 text-white` with CheckCircle2 icon |
| **In Progress** | `border-amber-400 text-amber-600` outline with Clock icon |
| **Not Started** | `text-muted-foreground` outline with Circle icon |
| **Locked** | `opacity-60` with Lock icon |

### Form Elements (Kid-Friendly)

- **PIN Input:** 4 large digit boxes (size-14 each), `text-2xl font-bold`, centered.
  Active box has `ring-2 ring-primary`. Animated digit entry with scale effect.
- **Search Input:** Rounded-full with search icon, generous padding (`px-4 py-3`).
- **Chat Input:** Rounded-xl with send button, supports voice input on supported devices.

### Loading States

- **Skeleton:** Use shadcn `Skeleton` matching the shape of content (rounded cards,
  text lines, circular avatars).
- **Spinner:** A simple rotating circle animation for button loading states.
- **Progress bar:** Linear progress for operations with known duration (firmware flash,
  lesson loading).
- **Animated dots:** Three bouncing dots for AI "thinking" state in chat.

### Empty States

Every empty state follows the same pattern:
```
Card (rounded-2xl, py-12, text-center)
  Large icon (size-10, text-muted-foreground/40)
  Descriptive text (text-sm, text-muted-foreground)
  Optional CTA button
```

---

## 6. Illustration & Iconography

### Icon System

TinkerSchool uses **Lucide React** as its icon library (configured via shadcn/ui).

**Icon sizing scale:**

| Context | Size | Class |
|---|---|---|
| Inline with text | 16px | `size-4` |
| Button icon | 16px | `size-4` |
| Card accent | 20-24px | `size-5` or `size-6` |
| Empty state / hero | 40px | `size-10` |
| Feature highlight | 48px | `size-12` |

**Icon color rules:**
- Default: inherit from text color
- Subject-specific: use inline `style={{ color: subject.color }}`
- Muted: `text-muted-foreground`
- Interactive hover: `group-hover:text-primary`

### Subject Icons

| Subject | Icon | Lucide Name |
|---|---|---|
| Math | Calculator | `calculator` |
| Reading | Book Open | `book-open` |
| Science | Flask | `flask-conical` |
| Music | Music Note | `music` |
| Art | Palette | `palette` |
| Problem Solving | Puzzle | `puzzle` |
| Coding | Code | `code-2` |

### Illustration Style

TinkerSchool illustrations should feel hand-made and approachable, like classroom
bulletin board art. This creates warmth and distinguishes the brand from sterile
corporate education platforms.

**Style pillars:**
- **Flat with subtle depth:** No heavy 3D. Light shadows, overlapping shapes.
- **Rounded geometry:** Circles, rounded rectangles, organic curves. No sharp angles.
- **Limited palette per illustration:** Use 3-4 colors from the brand palette per illustration.
- **Textured but clean:** Subtle grain or paper texture, but not messy.
- **Human figures:** Simple, diverse, proportioned for kids. Large heads, expressive faces.
  No photorealistic humans.

### Chip Character Design

**Chip** is the AI buddy -- a friendly robot character.

**Visual identity:**
- Shape: Rounded rectangle body with circular head (like a friendly M5StickC Plus 2 device)
- Eyes: Two large, expressive circles (change shape for emotions -- happy crescents,
  surprised circles, thinking half-moons)
- Color: Primary purple body with sunshine yellow antenna/highlight
- Size: Compact, approximately 40x48px in standard UI contexts
- Expression states: Happy (default), Thinking (animated dots), Celebrating (confetti
  particles), Confused (tilted head), Encouraging (thumbs up)

**Chip personality in UI:**
- Appears in the chat interface as the avatar
- Shows in lesson intros with a speech bubble
- Celebrates achievements with animation
- Appears in empty states to guide the child

### Device Illustration (M5StickC Plus 2)

For marketing and instructional contexts, the M5StickC Plus 2 device should be
illustrated in the same flat style as other brand illustrations:
- Rounded rectangle body with visible screen, buttons, and USB-C port
- Screen shows colorful output (code result, smiley face, music notes)
- Slight angle (15-20 degrees) for depth
- Soft shadow beneath

---

## 7. Animation & Motion

### Design Philosophy

Animations in a children's education platform serve three purposes:
1. **Feedback:** Confirming that an action happened ("your code was saved!")
2. **Guidance:** Drawing attention to what matters next
3. **Celebration:** Rewarding effort and completion

Animations should never delay the child's workflow or feel sluggish. Speed is respect.

### Timing & Easing

| Type | Duration | Easing | Usage |
|---|---|---|---|
| **Micro-interaction** | 150-200ms | `ease-out` | Hover states, button press, toggle |
| **UI transition** | 200-300ms | `ease-out` | Panel open/close, tab switch, card enter |
| **Celebration** | 400-800ms | `spring` | Badge earned, lesson complete, confetti |
| **Page transition** | 300-400ms | `ease-in-out` | Route changes, major view shifts |

### Core Framer Motion Patterns

**Fade-in-up (standard entrance):**
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
}

// Usage
<motion.div {...fadeInUp}>
  <Card>...</Card>
</motion.div>
```

**Stagger children (list/grid entrance):**
```tsx
const container = {
  animate: { transition: { staggerChildren: 0.06 } }
}
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" }
}

// Usage
<motion.div variants={container} initial="initial" animate="animate">
  {items.map(i => <motion.div key={i.id} variants={item}>...</motion.div>)}
</motion.div>
```

**Scale pop (interactive elements):**
```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  Start Lesson
</motion.button>
```

**Card hover lift:**
```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  <Card>...</Card>
</motion.div>
```

**Slide panel (sheet/sidebar):**
```tsx
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", damping: 25, stiffness: 300 }}
/>
```

### Celebration Animations

**Badge earned:**
1. Badge icon scales from 0 to 1 with spring bounce
2. Confetti burst from center (using `canvas-confetti` library)
3. Star particles radiate outward
4. Chip character appears with congratulations speech bubble

```tsx
// Badge entrance
const badgeEarned = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: "spring", damping: 12, stiffness: 200, delay: 0.2 }
}
```

**Lesson complete:**
1. Checkmark draws on (SVG path animation, 400ms)
2. Progress bar fills to 100% (300ms)
3. Background briefly flashes with subject color tint
4. Confetti shower (canvas-confetti, 1.5s)

**Correct answer:**
- Quick green flash (200ms)
- Subtle scale bounce on the answer element
- Optional: short buzzer tone from device

### Page Transitions

Use `AnimatePresence` with `mode="wait"` for route transitions:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Performance Rules

- Animate only GPU-friendly properties: `transform` (x, y, scale, rotate) and `opacity`
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`
- Use `will-change: transform` sparingly and only during active animation
- Stagger list items to distribute render cost (0.04-0.08s between items)
- Use `layout` prop cautiously -- it can cause expensive layout recalculations
- Target 60fps on mid-range devices (test on real hardware)
- Disable complex animations when `prefers-reduced-motion: reduce` is set

---

## 8. Landing Page Blueprint

The landing page (at `tinkerschool.ai`, unauthenticated) speaks to **parents** while
showing what **kids** will experience. It must communicate trust, educational value,
and the hardware + AI differentiator within 5 seconds.

### Section 1: Hero

**Layout:** Full-width, generous padding (`py-24 px-6`), centered content.
**Background:** Subtle gradient `from-[#3B82F6]/10 via-[#A855F7]/10 to-[#EC4899]/10`
with a radial glow from top center.

**Content stack (top to bottom):**
1. Logo icon + "TinkerSchool" wordmark (`text-5xl font-bold`)
2. Primary tagline: "Where every kid is a genius waiting to bloom" (`text-2xl font-medium text-primary`)
3. Description: 1-2 sentences about Chip + hardware + multi-subject (`text-lg text-muted-foreground, max-w-xl`)
4. Two CTAs:
   - "Get Started" (primary, `size="lg" rounded-full px-8`)
   - "See How It Works" (outline, `size="lg" rounded-full px-8`)

**Illustration/Visual:** Floating M5StickC device illustration on the right (desktop) or
below content (mobile). Device screen shows a colorful output. Chip character waves nearby.

### Section 2: Subject Showcase

**Heading:** "7 Subjects, Infinite Curiosity" with sparkle icon
**Subheading:** "Every subject is an adventure..."
**Layout:** Responsive grid of 7 subject cards (4 columns desktop, 2 tablet, 1 mobile)

Each card:
- Subject color left border (4px)
- Tinted background (subject color at 8% opacity)
- Icon in rounded container with 12% opacity bg
- Subject name in subject color
- One-line description

**Animation:** Staggered fade-in-up on scroll entry.

### Section 3: Features (How It Works)

**Heading:** "Built for How Kids Actually Learn" with heart icon
**Background:** Subtle muted section (`bg-muted/30`)
**Layout:** 3-column grid (single column on mobile)

Three feature cards:
1. **AI Buddy Chip** (Bot icon) -- Personal AI tutor that asks questions, never gives answers
2. **Hands-On Hardware** (Cpu icon) -- Real device with screen, sensors, and buzzer
3. **Open Source** (Globe icon) -- Free curriculum, community-powered

Each card: `rounded-2xl`, icon in `bg-primary/10` container, title, description.

### Section 4: Device Showcase

**NEW SECTION -- differentiator**

**Heading:** "The Classroom in Your Hand"
**Layout:** Split -- device illustration on left, feature list on right (stacked on mobile)

**Left side:** Large M5StickC Plus 2 illustration (or photo with brand treatment)
showing the device at an angle with colorful screen output.

**Right side:** Feature checklist:
- 1.14" color display
- 2 tactile buttons
- Buzzer for sound experiments
- Motion sensors for physical learning
- WiFi for multiplayer activities
- USB-C connection to any computer
- Fits in a kid's hand

**CTA:** "Works with any Chromebook or laptop" with browser logos.

### Section 5: Curriculum Overview

**Heading:** "Learning Paths for Every Stage"
**Layout:** Horizontal tabs or cards showing the 5 bands:
- Explorer (K-1)
- Builder (2-3) -- "Cassidy starts here" badge
- Inventor (3-4)
- Hacker (4-5)
- Creator (5-6)

Brief description of what each band covers. Emphasis on progression from blocks to
Python, visual to text.

### Section 6: Social Proof

**Heading:** "Loved by Families"
**Content:**
- Testimonial cards (when available)
- Key stats: "7 subjects", "X lessons", "100% free and open source"
- Open-source badge / GitHub stars counter
- Awards or recognitions (when available)

### Section 7: Call to Action

**Layout:** Full-width purple gradient background
**Heading:** "Ready to Start Tinkering?" (large, white text)
**Subheading:** One sentence about getting started
**CTA:** "Create Free Account" (large white button on purple)
**Subtext:** "No credit card required. Always free. Always open source."

### Section 8: Footer

**Layout:** Multi-column footer on muted background

**Columns:**
- **Product:** Features, Subjects, Curriculum, Device
- **Community:** GitHub, Discord, Contributing
- **Parents:** Dashboard, Safety, Privacy Policy
- **Company:** About, Blog, Contact

**Bottom bar:** Copyright, "Made with [heart] for curious kids everywhere"

---

## 9. Accessibility

### WCAG Compliance

TinkerSchool targets **WCAG 2.1 Level AA** with aspirations toward AAA for
text contrast. The audience includes children with varying abilities, so
accessibility is not optional.

### Color Contrast

| Element | Foreground | Background | Ratio | Requirement |
|---|---|---|---|---|
| Body text | `#1E1B4B` | `#FFFFFF` | 14.5:1 | AAA (7:1) |
| Muted text | `#64748B` | `#FFFFFF` | 4.7:1 | AA (4.5:1) |
| Primary button text | `#FFFFFF` | `#7C3AED` | 4.6:1 | AA (4.5:1) |
| Link text | `#7C3AED` | `#FFFFFF` | 5.1:1 | AA (4.5:1) |

**Rule:** All subject colors must pass 3:1 contrast against white for non-text
indicators (icons, borders, progress bars) per WCAG 1.4.11.

### Touch Targets

Following WCAG 2.5.5 (Target Size Enhanced) and Apple HIG:

| Element | Minimum size | Recommended |
|---|---|---|
| Buttons (kid-facing) | 44x44px | 48x48px |
| Navigation links | 44x44px | 48x48px |
| PIN digit input | 56x56px | 64x64px |
| Lesson list rows | 44px height | 48px height |
| Icon-only buttons | 44x44px | 48x48px |

**Rule:** Touch targets for kid-facing interfaces should be at least 44px. Compact
UIs (parent dashboard, settings) may use 36px minimum.

### Keyboard Navigation

- All interactive elements must be focusable and operable via keyboard
- Focus order must follow visual reading order (left-to-right, top-to-bottom)
- Focus ring: `ring-[3px] ring-primary/50` (visible, not subtle)
- Skip-to-content link at the top of every page
- Escape key closes modals, sheets, and dropdowns
- Arrow keys navigate within tab groups, Blockly toolbox, and lesson lists

### Screen Reader Support

- All images have descriptive `alt` text
- Icon-only buttons have `aria-label`
- Progress bars have `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Live regions (`aria-live="polite"`) for:
  - AI chat messages
  - Device connection status changes
  - Lesson completion announcements
  - Flash progress updates
- Subject colors are never the sole indicator -- always paired with text or icons

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all Framer Motion animations */
  /* Disable confetti */
  /* Disable card hover lifts */
  /* Keep opacity transitions at 0 duration */
}
```

In code, check `useReducedMotion()` from Framer Motion and conditionally disable
spring animations, stagger effects, and celebration animations.

### Content Accessibility for Children

- **Reading level:** All kid-facing text should be at or below 3rd grade reading level
- **Audio support:** Key instructions should be available as audio (text-to-speech)
- **Visual clarity:** No text over busy backgrounds or images
- **Error recovery:** Errors should be forgiving. "Oops! Let's try that again." not
  "Error: Invalid input in field 3."
- **Undo support:** Destructive actions always have confirmation or undo

---

## 10. Industry Design Principles

Principles distilled from research into leading K-6 education platforms.

### Character-Driven Engagement

- A recurring mascot character creates emotional connection and continuity across the platform
- The character should have distinct expression states (happy, thinking, celebrating, encouraging) so it feels alive
- Use the character in empty states, lesson intros, chat interfaces, and celebrations
- TinkerSchool's **Chip** fills this role as the AI buddy

### Clean, Functional Design Over Decoration

- Uncluttered interfaces let content breathe -- whitespace is a feature, not wasted space
- Reduce variant bloat: keep button, badge, and card variants to a small, coherent set
- Limit the functional color palette (aim for ~18 core colors) rather than adding new colors per feature
- Use blue for action, red for warnings, green for affirmation -- follow established conventions

### Dual-Audience Design

- The platform must be professional enough for parents and clear enough for kids
- Parent-facing content (landing page, dashboard) uses a confident, data-informed tone
- Kid-facing content uses short sentences, large touch targets, and encouraging language
- Both audiences share the same visual system -- consistency builds trust

### Unhurried Spacing Philosophy

- Generous whitespace signals "take your time" -- critical for a learning environment
- Use 60px+ between major sections on desktop, 40px on mobile
- Pill-shaped buttons (`rounded-full`) feel friendly and approachable for hero CTAs
- Don't cram content -- fewer items per viewport with clear visual hierarchy

### Data-Driven Trust Signals

- Concrete numbers create social proof: "X lessons available", "100% free and open source"
- Real-time counters (e.g., "questions answered") create momentum and community feeling
- Research-backed credibility signals (certifications, methodology references) build parent trust
- Grade-level browsing makes finding content intuitive for parents evaluating the platform

### Typography Principles for Education

- Clean sans-serif fonts with good x-height ratio maximize readability for young readers
- A single font family (with mono variant for code) reduces visual noise
- Generous line height (1.6+) for body text helps developing readers track lines
- Multiple heading levels create clear content hierarchy without decoration

### Progressive Learning Paths

- Adaptive paths that meet kids where they are build confidence
- Clear curriculum structure with grade-by-grade organization helps parents understand scope
- Visual progression indicators (progress bars, completion badges) motivate continued engagement
- Seasonal content updates and fresh challenges keep the experience from feeling stale

### TinkerSchool's Unique Positioning

No other K-6 education platform combines all five of these:
1. **Open-source** free curriculum
2. **Physical hardware** (M5StickC Plus 2)
3. **Personalized AI tutor** (Chip)
4. **Multi-subject** integration (7 subjects connected through projects)
5. **Progressive coding** (blocks -> Python)

The design must communicate all five differentiators within the first scroll of the
landing page. The hardware device is the strongest visual differentiator -- it should
be prominently featured in the hero section and throughout marketing materials.

---

## Appendix A: Color Quick Reference

```
Brand:        #7C3AED (TinkerPurple)     #F472B6 (CoralPink)
Utility:      #FBBF24 (Yellow)           #34D399 (Green)          #EF4444 (Red)
Subjects:     #3B82F6 (Math)             #22C55E (Reading)        #F97316 (Science)
              #A855F7 (Music)            #EC4899 (Art)            #EAB308 (Problem Solving)
              #14B8A6 (Coding)
Neutrals:     #1E1B4B (Ink)              #64748B (Slate)          #F8FAFC (Mist)
              #E2E8F0 (Cloud)            #FFFFFF (White)
```

## Appendix B: Tailwind Class Quick Reference

```
Buttons:      rounded-xl px-6 py-3 (primary)    rounded-full px-8 (hero CTA)
Cards:        rounded-2xl border shadow-sm       p-5 or p-6 content padding
Text:         text-sm body, text-xs caption       text-2xl page title
Spacing:      gap-3 within cards, gap-6 between cards, gap-8 between sections
Focus:        focus-visible:ring-[3px] focus-visible:ring-primary/50
Transitions:  transition-all duration-200 ease-out (hover states)
```

## Appendix C: File Reference

| File | Purpose |
|---|---|
| `app/globals.css` | All CSS custom properties, theme variables, subject colors |
| `components/ui/` | shadcn/ui base components (do not modify directly) |
| `components/` | TinkerSchool wrapper components with brand styling |
| `lib/utils.ts` | `cn()` utility for conditional class merging |
| `app/layout.tsx` | Root layout with Nunito font loading |
| `public/images/` | Brand assets, illustrations, device photos |
| `public/sounds/` | Audio feedback files |
