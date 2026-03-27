# Repository Guidelines

## Project Structure & Module Organization
`app/` contains the Next.js App Router routes for kid, parent, onboarding, blog, and API flows. Reusable UI lives in `components/` and `components/ui/`. Shared logic, device integrations, AI helpers, and data utilities live in `lib/`. Custom hooks are in `hooks/`, long-form content in `content/blog/`, supporting docs in `docs/`, end-to-end coverage in `e2e/`, and database schema work in `supabase/migrations/` plus `supabase/seed.sql`.

## Build, Test, and Development Commands
Use `npm` with Node 20+.

- `npm run dev` starts the app on `http://localhost:3020`.
- `npm run build` creates the production Next.js build.
- `npm run start` serves the built app.
- `npm run lint` runs ESLint across the repo.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm run test` runs Vitest unit and component tests.
- `npm run test:e2e` runs Playwright tests in `e2e/`.

For local setup, copy `.env.local.example` to `.env.local` and use `npx supabase db push` when schema changes are involved.

## Coding Style & Naming Conventions
This codebase uses TypeScript, React 19, and Next.js. Follow the existing style: 2-space indentation, double quotes, semicolons, and small focused functions. Use PascalCase for React component exports, camelCase for variables and functions, and kebab-case for file names such as `chip-chat.tsx` or `voice-bridge.ts`. Keep route-specific code close to its route and shared code in `lib/` or `components/`.

## Testing Guidelines
Vitest is configured for `**/*.test.{ts,tsx}` with `jsdom`, so keep unit tests adjacent to the implementation when practical, for example `lib/serial/web-serial.ts` and `lib/serial/web-serial.test.ts`. Keep higher-level security checks in `__tests__/` and browser flows in `e2e/*.spec.ts`. Run `npm run test` before opening a PR; run `npm run test:e2e` for UI, routing, or device-flow changes.

## Commit & Pull Request Guidelines
Recent history uses short, imperative, sentence-case subjects such as `Fix active kid resolution across all server actions` and `Add tests for voiceAutoConnect in lesson context builder`. Keep commits focused, avoid mixed concerns, and mention issue numbers only when relevant. PRs should include a clear summary, linked issue or context, test coverage notes, and screenshots or recordings for visible `app/` or `components/` changes.

## Security & Configuration Tips
Never commit secrets; keep them in `.env.local`. Use `.env.local.example` as the source of truth for required variables. If you touch device flashing flows, keep firmware binaries under `public/firmware/` and validate browser-dependent features in Chrome or Edge because Web Serial support is required.
