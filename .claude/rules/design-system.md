# TinkerSchool Design System Rules

> Condensed, actionable design rules for every frontend session.
> Full reference: `docs/DESIGN-BIBLE.md`

## Brand Colors (memorize these)

```
Primary:     #F97316 (TinkerOrange, matches Chip mascot) -- oklch(0.65 0.19 50)
Secondary:   #F472B6 (CoralPink)
Success:     #22C55E | Warning: #EAB308 | Error: #EF4444 | Info: #3B82F6

Subjects:
  Math:             #3B82F6 (blue)
  Reading:          #22C55E (green)
  Science:          #F97316 (orange)
  Music:            #A855F7 (purple)
  Art:              #EC4899 (pink)
  Problem Solving:  #EAB308 (yellow)
  Coding:           #14B8A6 (teal)

Neutrals:
  Ink (text):    #1C1917     Slate (secondary text): #64748B
  Mist (bg):     #F8FAFC     Cloud (borders):        #E2E8F0
```

## Typography Rules

- Font: Nunito (headings + body), Geist Mono (code). Already loaded in root layout.
- Display: `text-4xl sm:text-5xl md:text-6xl font-bold leading-tight` -- hero only.
- H1: `text-2xl font-bold tracking-tight` -- page titles.
- H2: `text-lg font-semibold` -- section titles.
- H3: `text-base font-semibold` -- card titles.
- Body: `text-sm` or `text-base` with `leading-relaxed` -- descriptions.
- Caption: `text-xs font-medium` -- metadata, progress labels.
- Minimum kid-facing text: 14px (`text-sm`). Never smaller except parent-only metadata.
- Max body text width: `max-w-xl`. Max hero tagline: `max-w-2xl`.
- Never use `font-extrabold` or `font-black`.

## Spacing Patterns

- Within cards: `gap-3` between elements, `p-5` or `p-6` for content padding.
- Between cards in a grid: `gap-3` (compact) or `gap-6` (standard).
- Between page sections: `gap-8` (dashboard) or `py-20` (landing page).
- Hero vertical padding: `py-24`.
- Use `gap-*` over `margin-*` everywhere possible.

## Border Radius

- Base radius: `1rem` (16px). The project uses generous rounding.
- Buttons: `rounded-xl` (standard) or `rounded-full` (hero CTAs, pill buttons).
- Cards: `rounded-2xl` always.
- Inputs: `rounded-md` or `rounded-lg`.
- Avatars/circles: `rounded-full`.
- Icon containers: `rounded-xl`.

## Component Rules

### Buttons
- Primary CTA: `<Button size="lg" className="rounded-xl">` with purple bg.
- Hero CTA: `<Button size="lg" className="rounded-full px-8">` -- pill shape.
- Secondary: `variant="outline"` with `rounded-xl`.
- Ghost: `variant="ghost"` for navigation-style links.
- Always pair icon + text for primary actions: `<Icon className="size-4" /> Label`.
- Minimum touch target: 44px for kid-facing, 36px for parent-only.

### Cards
- Always `rounded-2xl`.
- Subject cards: add `border-l-4` with subject color, tinted bg at 8% opacity.
- Use `shadow-sm` default, `hover:shadow-md` for interactive cards.
- Empty states: icon (size-10), text, optional CTA -- all centered in a card.

### Status Badges
- Completed: `bg-emerald-600 text-white` + CheckCircle2 icon.
- In Progress: `border-amber-400 text-amber-600` outline + Clock icon.
- Not Started: `text-muted-foreground` outline + Circle icon.

### Subject Color Usage
- Icon containers: `style={{ backgroundColor: \`\${color}1F\` }}` (12% opacity).
- Card backgrounds: `style={{ backgroundColor: \`\${color}14\` }}` (8% opacity).
- Left borders: `style={{ borderLeftColor: color }}`.
- Text: `style={{ color }}` on headings/icons.
- Progress bar fills: `style={{ backgroundColor: color }}`.

## Framer Motion Standards

Always import from `framer-motion`. Use `motion.div`, `motion.button`, etc.

### Standard Patterns (copy-paste ready)
```tsx
// Page/card entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}

// Button/interactive hover
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}

// Card hover lift
whileHover={{ y: -4 }}
transition={{ duration: 0.2, ease: "easeOut" }}

// Stagger children: container staggerChildren: 0.06, items use variants
```

### Animation Rules
- Max duration: 400ms for UI transitions, 800ms for celebrations.
- Easing: "easeOut" for entrances, spring for celebrations.
- Only animate `opacity`, `x`, `y`, `scale`, `rotate` -- never layout properties.
- Always respect `prefers-reduced-motion` via `useReducedMotion()`.
- Stagger list items at 0.04-0.08s intervals.

## Grid Patterns

```
Subject cards:    grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
Module cards:     grid gap-6 sm:grid-cols-2 xl:grid-cols-3
Feature cards:    grid gap-6 md:grid-cols-3
```

## Theme Variables

- Use `bg-background`, `text-foreground`, `border-border` -- never hardcode light/dark.
- Subject colors are in `:root` as `--subject-*` variables. Use `bg-subject-math` etc.
- Use `cn()` from `@/lib/utils` for all conditional class merging.

## Accessibility Minimums

- Color contrast: 4.5:1 for text, 3:1 for non-text indicators.
- Touch targets: 44px minimum for kid UI, 36px minimum for parent UI.
- Focus ring: `focus-visible:ring-[3px] focus-visible:ring-primary/50`.
- All icon-only buttons need `aria-label`.
- Progress bars need `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.
- Never use color alone to convey meaning -- pair with icon or text.

## Lucide Icon Sizes

- Inline/button: `size-4` (16px).
- Card accent: `size-5` or `size-6` (20-24px).
- Empty state: `size-10` (40px).
- Feature highlight: `size-12` (48px).

## Don'ts

- Don't modify files in `components/ui/` -- create wrappers in `components/`.
- Don't use `font-black`, `font-extrabold`, or weights above 700.
- Don't use `text-xs` for kid-readable content (only metadata/captions).
- Don't hardcode `bg-white` or `dark:bg-*` -- use theme variables.
- Don't animate `width`, `height`, `margin`, `padding`, `top`, `left`.
- Don't use sharp corners (`rounded-sm` or `rounded-none`) on kid-facing UI.
- Don't use more than 3-4 colors from the brand palette per component/illustration.
- Don't skip empty states -- every list/grid needs a friendly empty state with icon + text.
