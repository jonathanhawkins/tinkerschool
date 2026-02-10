/**
 * One-time Hume EVI configuration setup script.
 *
 * Creates (or updates) an EVI config with:
 * - Claude as the supplemental LLM
 * - Chip's system prompt
 * - UI control tools (highlight, celebrate, hint)
 * - A warm, friendly voice
 *
 * Usage:
 *   npx tsx scripts/setup-hume.ts
 *
 * Required env vars (in .env.local):
 *   HUME_API_KEY
 *   HUME_SECRET_KEY
 */

import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local from project root
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_SECRET_KEY = process.env.HUME_SECRET_KEY;
const CONFIG_NAME = "TinkerSchool Chip Voice";

if (!HUME_API_KEY || !HUME_SECRET_KEY) {
  console.error(
    "Missing HUME_API_KEY or HUME_SECRET_KEY in .env.local\n" +
      "Get your keys at https://platform.hume.ai/settings/keys"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Chip system prompt (voice-adapted version)
// ---------------------------------------------------------------------------

const CHIP_VOICE_PROMPT = `You are Chip, a friendly robot learning buddy for kids aged 5-12 on TinkerSchool!

## Your Voice Personality
- You sound cheerful, warm, and encouraging — like a fun older sibling
- You speak in short sentences (kids are LISTENING, not reading)
- You use simple words and avoid jargon
- You occasionally say fun robot things like "Beep boop!", "Circuit high-five!", or "Whirr... processing... AWESOME!"
- You celebrate every effort, even mistakes
- You NEVER give answers — you ask the RIGHT QUESTIONS to help kids discover answers themselves

## Voice-Specific Rules
- Keep responses to 1-3 SHORT sentences. Kids lose focus with long speech.
- Always end with a question to keep them engaged
- Use expressive tone — excitement, curiosity, warmth
- Pause briefly before important words for emphasis
- If the child sounds confused or frustrated (check their emotion), be extra patient and encouraging
- If the child sounds excited or happy, match their energy!

## Your Safety Rules
1. Only discuss: school subjects (math, reading, science, music, art, coding), creative projects, the M5StickC device, age-appropriate general knowledge
2. Gently redirect off-topic questions: "That's interesting! But let's get back to our adventure!"
3. Never use scary or negative language
4. Never give complete answers — guide through questions

## Tools
You can use tools to control the TinkerSchool UI:
- highlight_element: Spotlight a UI element to guide the child's attention
- show_celebration: Trigger a fun celebration animation when they accomplish something
- show_hint: Display a visual hint on screen to supplement your voice guidance`;

// ---------------------------------------------------------------------------
// Tool definitions (created via /tools endpoint, then referenced by ID)
// ---------------------------------------------------------------------------

const TOOL_SPECS = [
  {
    name: "highlight_element",
    description:
      "Spotlight a UI element to guide the child's attention. Use when referring to something on screen.",
    parameters: JSON.stringify({
      type: "object",
      properties: {
        target: {
          type: "string",
          description:
            'The name or ID of the UI element to highlight (e.g. "run-button", "code-editor", "display-preview")',
        },
      },
      required: ["target"],
    }),
  },
  {
    name: "show_celebration",
    description:
      "Trigger a fun celebration animation (confetti, sparkles). Use when the child accomplishes something or answers correctly.",
    parameters: JSON.stringify({
      type: "object",
      properties: {},
      required: [],
    }),
  },
  {
    name: "show_hint",
    description:
      "Display a visual hint on screen. Use sparingly — only when voice alone isn't enough, like showing a number, letter, or short phrase.",
    parameters: JSON.stringify({
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Short hint text to display (keep under 30 characters)",
        },
      },
      required: ["text"],
    }),
  },
];

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const API_BASE = "https://api.hume.ai/v0/evi";

async function humeRequest(
  path: string,
  method: "GET" | "POST" | "PATCH",
  body?: unknown
): Promise<unknown> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Hume-Api-Key": HUME_API_KEY!,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Hume API ${method} ${path} failed (${res.status}): ${text}`
    );
  }

  return res.json();
}

interface HumeResource {
  id: string;
  name: string;
}

interface PagedResponse<T> {
  tools_page?: T[];
  configs_page?: T[];
}

// ---------------------------------------------------------------------------
// Tool management — create tools first, then reference by ID
// ---------------------------------------------------------------------------

async function ensureTool(spec: {
  name: string;
  description: string;
  parameters: string;
}): Promise<string> {
  // List existing tools and find by name
  const list = (await humeRequest(
    "/tools?page_size=100",
    "GET"
  )) as PagedResponse<HumeResource>;
  const existing = list.tools_page?.find((t) => t.name === spec.name);

  if (existing) {
    console.log(`  Tool "${spec.name}" exists: ${existing.id}`);
    return existing.id;
  }

  // Create new tool
  const result = (await humeRequest("/tools", "POST", spec)) as HumeResource;
  console.log(`  Tool "${spec.name}" created: ${result.id}`);
  return result.id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Setting up Hume EVI config for TinkerSchool Chip Voice...\n");

  // 1. Ensure all tools exist
  console.log("Ensuring tools...");
  const toolIds: string[] = [];
  for (const spec of TOOL_SPECS) {
    const id = await ensureTool(spec);
    toolIds.push(id);
  }
  console.log("");

  // 2. Build tool references for config
  const toolRefs = toolIds.map((id) => ({ id }));

  // 3. Check for existing config
  const configList = (await humeRequest(
    "/configs?page_size=100",
    "GET"
  )) as PagedResponse<HumeResource>;
  const existingConfig = configList.configs_page?.find(
    (c) => c.name === CONFIG_NAME
  );

  const configBody = {
    name: CONFIG_NAME,
    language_model: {
      model_provider: "ANTHROPIC",
      model_resource: "claude-sonnet-4-5-20250929",
    },
    prompt: {
      text: CHIP_VOICE_PROMPT,
    },
    tools: toolRefs,
    voice: {
      provider: "HUME_AI",
      name: "KORA",
    },
    event_messages: {
      on_new_chat: {
        enabled: true,
        text: "Hey there! I'm Chip, your learning buddy! What are you working on today?",
      },
    },
  };

  let configId: string;

  if (existingConfig) {
    console.log(`Found existing config: ${existingConfig.id}`);
    console.log("Updating...");
    await humeRequest(
      `/configs/${existingConfig.id}`,
      "PATCH",
      configBody
    );
    configId = existingConfig.id;
    console.log("Updated!");
  } else {
    console.log("Creating new config...");
    const result = (await humeRequest(
      "/configs",
      "POST",
      configBody
    )) as HumeResource;
    configId = result.id;
    console.log("Created!");
  }

  console.log(`\nConfig ID: ${configId}\n`);
  console.log("Add this to your .env.local:\n");
  console.log(`  NEXT_PUBLIC_HUME_CONFIG_ID=${configId}\n`);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
