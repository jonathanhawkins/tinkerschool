---
paths:
  - "components/**/*.{ts,tsx}"
  - "app/**/*.tsx"
  - "lib/utils.ts"
---

# shadcn/ui Component Library

## Overview
- shadcn/ui is the component library. Components are copied into `components/ui/` -- we own them, not a dependency.
- Built on Radix UI primitives (accessible, composable, unstyled) + Tailwind CSS for styling.
- Add components via CLI: `npx shadcn@latest add <component>`
- Never install shadcn as a package -- it's a code generator, not a runtime dependency.

## Core Components Used

| Component | CodeBuddy Usage |
|---|---|
| `Button` | Flash to Device, Save Project, Send (chat), nav actions |
| `Dialog` | Share project confirmation, device reset, delete warning |
| `Tabs` | Blocks/Python toggle, lesson step tabs |
| `Tooltip` | Blockly toolbox hints, device status details |
| `Progress` | Lesson completion bar, firmware flash progress |
| `Avatar` | Kid profile selector on login screen |
| `Badge` | Achievement badges, connection status pill |
| `Card` | Lesson cards, project gallery, mission control panels |
| `Input` | PIN entry, AI chat input, search |
| `Skeleton` | Loading states for all async content |
| `ScrollArea` | Chat message list, lesson content panel |
| `DropdownMenu` | User menu, project actions menu |
| `Select` | Band selector, avatar picker |
| `Separator` | Section dividers |
| `Sheet` | Mobile sidebar navigation |

## Conventions

### cn() Utility
Always use `cn()` from `@/lib/utils` for conditional/merged classes:
```tsx
import { cn } from '@/lib/utils';
<Button className={cn("rounded-full", isFlashing && "animate-pulse")} />
```

### Customizing for Kids
- Override default shadcn sizing -- kids need larger targets. Use `size="lg"` or custom classes.
- Round everything aggressively: `rounded-full` for buttons, `rounded-2xl` for cards.
- Use CodeBuddy's color palette via CSS variables, not hardcoded Tailwind colors.
- Add Framer Motion animations to shadcn components for delight (badge earned, flash complete).

### CSS Variables (globals.css)
shadcn uses CSS variables for theming. Override the defaults in `app/globals.css`:
```css
:root {
  --primary: 270 60% 52%;        /* Purple - CodeBuddy brand */
  --primary-foreground: 0 0% 100%;
  --secondary: 330 65% 55%;      /* Pink - accent */
  --accent: 270 40% 95%;         /* Light purple - backgrounds */
  --destructive: 0 65% 55%;      /* Soft red - not scary */
  --radius: 1rem;                /* Rounded corners everywhere */
}
```

### Don't Reinvent
- If shadcn has a component for it, use it. Don't build custom dialogs, tooltips, or dropdowns.
- Extend shadcn components with wrapper components in `components/` when you need CodeBuddy-specific behavior (e.g., `FlashButton` wraps `Button` with serial logic).
- Keep `components/ui/` as close to shadcn defaults as possible -- customize in wrapper components instead.

### Accessibility
- shadcn/Radix components handle keyboard navigation, focus management, and ARIA attributes automatically. Don't override these.
- Always pass `aria-label` to icon-only buttons.
- Use `Tooltip` to explain icons and status indicators for kids who can't read small text.

### Server vs Client
- Most shadcn components are client-only (they use Radix which needs DOM). Mark wrapper components with `"use client"` when they use interactive shadcn primitives.
- Static display components (`Badge`, `Card` used as pure containers, `Separator`) can be used in Server Components if you don't attach event handlers.
