import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const FIRMWARE_URL =
  "https://github.com/m5stack/uiflow-micropython/releases/download/2.4.1/uiflow-417a5f8-esp32-spiram-8mb-stickcplus2-v2.4.1-20260115.bin";

const EXPECTED_SIZE = 8_384_512; // 8MB combined binary

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Follow GitHub redirect explicitly, then read the full binary
  const response = await fetch(FIRMWARE_URL, { redirect: "follow" });
  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to download firmware: ${response.status}` },
      { status: 502 },
    );
  }

  // Read full body as ArrayBuffer to ensure we get everything
  const data = await response.arrayBuffer();

  if (data.byteLength < EXPECTED_SIZE * 0.9) {
    console.error(
      `[firmware] Truncated download: got ${data.byteLength} bytes, expected ${EXPECTED_SIZE}`
    );
    return NextResponse.json(
      {
        error: `Firmware download truncated: got ${data.byteLength} bytes, expected ${EXPECTED_SIZE}`,
      },
      { status: 502 },
    );
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(data.byteLength),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
