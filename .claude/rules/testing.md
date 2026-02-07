# Testing Conventions

## Test Framework
- **Unit & Integration:** Vitest (not Jest). Config in `vitest.config.ts`.
- **E2E:** Playwright. Config in `playwright.config.ts`.
- **Component tests:** Vitest + React Testing Library.

## File Naming
- Unit tests: `*.test.ts` or `*.test.tsx` colocated next to source files.
- E2E tests: `e2e/*.spec.ts` in project root.
- Test utilities/fixtures: `__tests__/` directories or `test-utils.ts`.

## What to Test
- Server Actions: test auth checks, database operations, revalidation calls.
- Custom Blockly blocks: test code generation output matches expected MicroPython.
- `wrap-m5stick.ts`: test boilerplate wrapping produces valid Python.
- Clerk auth helpers: test redirect behavior for unauthenticated/missing profile cases.
- Supabase RLS: test policies work correctly for parent vs kid roles.
- Web Serial manager: mock `navigator.serial` for connection/disconnect flows.
- AI buddy: test system prompt construction, test that streaming route requires auth.

## What NOT to Test
- Don't test Next.js framework behavior (routing, middleware plumbing).
- Don't test third-party library internals (Blockly rendering, Monaco editor).
- Don't write snapshot tests for UI components -- they're brittle and low-value.

## E2E Tests (Playwright)
- Test the full kid flow: login -> open lesson -> write code -> flash to simulator -> complete lesson.
- Test parent flow: login -> view dashboard -> see kid progress.
- Mock the Claude API for AI buddy tests (don't make real API calls in CI).
- Mock Web Serial API (not available in headless Chrome).

## Running Tests
```bash
npm run test           # Vitest (watch mode)
npm run test:run       # Vitest (single run, CI)
npm run test:e2e       # Playwright
```
