import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// ---------------------------------------------------------------------------
// Demo chat API -- no auth, IP rate-limited, cost-efficient
// ---------------------------------------------------------------------------

/** In-memory rate limiter for demo (per-IP, resets on restart). */
const ipHits = new Map<string, { count: number; resetAt: number }>();
const MAX_DEMO_HITS = 20; // per hour per IP
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkDemoRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not limited
  }

  entry.count++;
  return entry.count > MAX_DEMO_HITS;
}

/** Max messages allowed in a single demo session. */
const MAX_DEMO_MESSAGES = 10;

/** System prompt for demo mode -- short, fun, generates runnable code. */
const DEMO_SYSTEM_PROMPT = `You are Chip, a friendly AI learning buddy for kids ages 5-12. You're on the TinkerSchool landing page helping a visitor try out the platform for the first time.

Your personality:
- Warm, excited, encouraging
- Use simple words (age 7 reading level)
- Keep responses to 2-3 short sentences max
- Add one emoji per message (only one!)

Your job:
- Guide the visitor to create something cool that runs on a tiny computer simulator
- When you show code, wrap it in a \`\`\`python code block
- The code uses MicroPython M5StickC Plus 2 APIs:
  - Lcd.fillScreen(0x000000) -- fill screen with color (hex RGB565 or 0x000000 for black)
  - Lcd.drawString("text", x, y, 0xFFFFFF) -- draw text at position with color
  - Lcd.fillRect(x, y, width, height, 0xFF0000) -- filled rectangle
  - Lcd.fillCircle(x, y, radius, 0x00FF00) -- filled circle
  - Lcd.drawLine(x1, y1, x2, y2, 0xFFFF00) -- draw line
  - Speaker.tone(frequency, duration_ms) -- play a tone
  - time.sleep(seconds) -- pause
  - time.sleep_ms(ms) -- pause in milliseconds
- Screen is 135 pixels wide, 240 pixels tall
- Always start code with: from M5 import *
- Always start with Lcd.fillScreen(0x000000) to clear screen

Demo scenarios -- when the visitor picks one, give them the code right away:

1. "Show my name" -- Ask their name, then generate code that clears screen and draws their name big and colorful
2. "Count to 10" -- Generate a counting animation with colorful numbers
3. "Play a song" -- Generate code that plays a simple melody (Twinkle Twinkle or similar) with Speaker.tone

After showing code, say something encouraging like "Click Run to see it work!" or "See what happens on the tiny screen!"

If they want to modify the code, help them with small changes (different colors, different text, etc.)

IMPORTANT: Keep it brief. This is a demo -- get to the cool result fast. Don't over-explain.`;

// ---------------------------------------------------------------------------
// POST /api/demo-chat
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // 1. IP-based rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (checkDemoRateLimit(ip)) {
    return new Response(
      JSON.stringify({
        error: "Chip is taking a little break! Sign up for unlimited chats.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 2. Parse body
  let body: { messages?: UIMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length > MAX_DEMO_MESSAGES) {
    return new Response(
      JSON.stringify({ error: "Too many messages -- sign up to keep chatting!" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 3. Stream with GPT-5 Nano for cost efficiency ($0.05/$0.40 per M tokens)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-5-nano"),
    system: DEMO_SYSTEM_PROMPT,
    messages: modelMessages,
    maxOutputTokens: 250,
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}
