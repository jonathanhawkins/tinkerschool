# Large File Serving

- **Never proxy files >4MB through Next.js API routes.** The Turbopack dev server silently truncates large binary responses. Use the `public/` directory for large static assets (firmware binaries, media files, etc.).
- When adding files with non-standard extensions (`.bin`, `.elf`, `.hex`, etc.) to `public/`, verify that Clerk middleware doesn't block them. The middleware matcher only excludes common web extensions. Add the path to the `isPublicRoute` matcher in `proxy.ts` if needed.
- Firmware binaries live in `public/firmware/`. The UIFlow2 combined binary is ~8MB and must be served intact — any truncation causes "invalid header" boot loops on the device.
