---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# UI & Design for Kids

## Design Principles
- This platform is for kids ages 5-12. Every UI decision should ask: "Would a 7-year-old understand this?"
- Large touch targets (minimum 44x44px). Bright, high-contrast colors. Playful but readable fonts.
- Minimal text -- supplement with icons, images, and (eventually) audio narration.
- Instant feedback on every interaction -- visual and/or audible response.
- Safe to fail -- everything is undoable, nothing breaks permanently. Show encouraging error messages.

## Component Library: shadcn/ui + Tailwind CSS 4
- Use shadcn/ui components from `components/ui/` as the foundation for all UI. See `.claude/rules/frontend/shadcn.md` for details.
- Use `cn()` from `@/lib/utils` for all conditional class merging.
- Extend shadcn components with kid-friendly overrides -- never fight the defaults, wrap them.

## Color Palette (CSS Variables in globals.css)
- Primary: purple (`--primary: 270 60% 52%`) -- CodeBuddy brand, Cassidy's favorite
- Secondary: pink (`--secondary: 330 65% 55%`) -- accent
- Success: green-500
- Warning: amber-500
- Error/Destructive: soft red (`--destructive: 0 65% 55%`) -- not too alarming for kids
- Backgrounds: white, gray-50, purple-50 (`--accent: 270 40% 95%`)
- Text: gray-800 (body), purple-700 (headings)
- Border radius: `--radius: 1rem` (rounded everywhere)

## Component Patterns
- Use shadcn `Card` with `rounded-2xl` for lesson cards, project panels, dashboard widgets.
- Use shadcn `Button` with `rounded-full`, bold text, generous padding for all actions.
- Use shadcn `Progress` for lesson completion, flash progress, achievement bars.
- Use shadcn `Skeleton` for all loading states (matches final component dimensions).
- Use Framer Motion for celebration animations (badge earned, project saved, flash complete).
- The "Flash to Device" button should be prominent and satisfying -- it's the highlight of every session.

## Accessibility
- shadcn/Radix handles keyboard nav and ARIA automatically -- don't override.
- Support dyslexia-friendly font toggle (OpenDyslexic).
- All interactive elements must have visible focus states (shadcn provides these).
- Images need alt text. Icon-only buttons need aria-labels + `Tooltip`.
- Color is never the only indicator -- always pair with shape/icon/text.
