# TinkerSchool

**Where every kid is a genius waiting to bloom.**

TinkerSchool is an open-source, AI-powered education platform that pairs kids (K-6) with an [M5StickC Plus 2](https://shop.m5stack.com/products/m5stickc-plus2-esp32-mini-iot-development-kit) device and a personalized AI tutor named **Chip** to learn all subjects through hands-on, interactive projects.

**7 Subjects:** Math, Reading, Science, Music, Art, Problem Solving, and Coding — all taught through real hardware projects that kids can see, hear, and hold.

## Features

- **AI Tutor "Chip"** — A personalized AI buddy powered by Claude that adapts to each child's learning style. Chip never gives answers — instead, it asks the right questions to spark discovery.
- **Hands-On Hardware** — Every lesson uses the M5StickC Plus 2: tilt sensors for math, buttons for spelling, buzzer for music, LEDs for art, and more.
- **Block + Text Coding** — Start with drag-and-drop Blockly blocks, peek at the Python underneath, and graduate to writing real MicroPython.
- **Parent Dashboard** — Track progress across all subjects, review AI conversations, and manage family settings.
- **Curriculum Bands** — Five progression levels (Explorer through Creator) that grow with each child from kindergarten through 6th grade.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| UI | shadcn/ui, Framer Motion |
| Block Editor | Google Blockly |
| Text Editor | Monaco Editor |
| AI | Claude API (Anthropic) + Vercel AI SDK |
| Auth | Clerk (Organizations for family model) |
| Database | Supabase (PostgreSQL + RLS) |
| Device | Web Serial API, esptool-js |
| Testing | Vitest + Playwright |

## Prerequisites

- **Node.js** 20+
- **Chrome** or **Edge** 89+ (required for Web Serial API)
- **M5StickC Plus 2** device ([~$20 on Amazon](https://www.amazon.com/dp/B0DB4PJKXD)) — optional, the app includes a simulator
- Accounts on [Clerk](https://clerk.com), [Supabase](https://supabase.com), and [Anthropic](https://console.anthropic.com)

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/jonathanhawkins/tinkerschool.git
   cd tinkerschool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your API keys from Clerk, Supabase, and Anthropic. See `.env.local.example` for all required variables.

4. **Set up the database**
   ```bash
   npx supabase db push
   ```

5. **Download the firmware** (optional, for device flashing)

   Download the [UIFlow2 v2.4.1 firmware](https://github.com/m5stack/uiflow-micropython/releases) and place it at:
   ```
   public/firmware/uiflow2-stickcplus2-v2.4.1.bin
   ```

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3020](http://localhost:3020) in Chrome.

## Development

```bash
npm run dev          # Start dev server (port 3020)
npm run build        # Production build
npm run test         # Run Vitest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run lint         # ESLint
```

## Project Structure

```
app/
  (auth)/           # Sign-in/sign-up pages
  (dashboard)/      # Kid-facing dashboard (lessons, subjects, chat, workshop)
  (parent)/         # Parent dashboard (progress, AI history)
  api/              # API routes (AI buddy, webhooks)
  onboarding/       # Family + kid profile setup
components/         # Shared React components
lib/
  ai/               # Chip system prompt & AI helpers
  auth/             # Server-side auth utilities
  blocks/           # Custom Blockly block definitions
  codegen/          # MicroPython code generation
  serial/           # Web Serial & device communication
  supabase/         # Database client & types
supabase/
  migrations/       # SQL schema migrations
public/
  firmware/         # Device firmware binaries (gitignored)
  images/           # Static images (Chip mascot, etc.)
```

## M5StickC Plus 2

The M5StickC Plus 2 is a tiny ESP32-based development kit with a color display, buttons, IMU, buzzer, and LED. TinkerSchool communicates with it over USB using the Web Serial API and MicroPython.

- **Chip:** ESP32-PICO-V3-02
- **Display:** 1.14" TFT (135x240)
- **USB:** CH9102 serial chip
- **Programming:** MicroPython via raw REPL paste mode

No device? No problem — the app includes a built-in simulator for trying out lessons without hardware.

## Contributing

Contributions are welcome! Whether you're adding new lessons, fixing bugs, improving accessibility, or translating content — we'd love your help.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome-thing`)
3. Make your changes
4. Run tests (`npm run test`)
5. Open a pull request

## License

[MIT](LICENSE)

---

Built with care for Cassidy and kids everywhere.
