# Code Style

- Use TypeScript strict mode for all files. Never use `any` -- define proper types or use `unknown`.
- Use `interface` for object shapes, `type` for unions/intersections/utility types.
- Prefer named exports over default exports, except for Next.js page/layout/loading components which must be default exports.
- Use arrow functions for callbacks and inline functions. Use `function` declarations for top-level named functions and React components.
- Use early returns to reduce nesting. Guard clauses go first.
- Destructure props in function parameters: `function Component({ name, age }: Props)`.
- Prefer `const` over `let`. Never use `var`.
- Use template literals over string concatenation.
- File naming: `kebab-case.ts` for utilities, `kebab-case.tsx` for components. Directories are `kebab-case`.
- Component naming: `PascalCase`. Hooks: `useCamelCase`. Utilities: `camelCase`.
- Keep files focused -- one component per file, one utility per file where reasonable.
- Use `@/` path alias for imports from project root (maps to project root).
- Import order: React/Next.js, external packages, internal `@/` imports, relative imports. Group with blank lines.
- Tailwind CSS 4 for all styling. No CSS modules, no styled-components. Use `cn()` utility from `@/lib/utils` (clsx + tailwind-merge) for conditional classes.
- Use shadcn/ui components from `components/ui/` for all UI primitives (Button, Dialog, Card, Tabs, etc.). Add new ones via `npx shadcn@latest add <component>`.
- Don't modify shadcn components in `components/ui/` directly -- create wrapper components in `components/` for CodeBuddy-specific behavior.
- Prefer Tailwind classes over inline styles. Extract repeated patterns into components, not utility classes.
- This is a kids' education platform -- keep UI code readable and well-structured. Future contributors may be educators, not senior engineers.
