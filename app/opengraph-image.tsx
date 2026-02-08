import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "TinkerSchool - Where every kid is a genius waiting to bloom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NUNITO_FONT_URL =
  "https://fonts.gstatic.com/s/nunito/v32/XRXI3I6Li01BKofiOc5wtlZ2di8HDFwmRTM.ttf";

export default async function OGImage() {
  // Load the Chip mascot image as base64
  const chipImageData = await readFile(
    join(process.cwd(), "public/images/chip.png")
  );
  const chipBase64 = `data:image/png;base64,${chipImageData.toString("base64")}`;

  // Load Nunito Bold font for consistent branding
  let nunitoFont: ArrayBuffer | null = null;
  try {
    const fontResponse = await fetch(NUNITO_FONT_URL);
    if (fontResponse.ok) {
      nunitoFont = await fontResponse.arrayBuffer();
    }
  } catch {
    // Font fetch failed -- proceed with default sans-serif
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FF8C3A 0%, #F97316 40%, #EA580C 100%)",
          fontFamily: nunitoFont ? "Nunito" : "sans-serif",
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            padding: "0 80px",
          }}
        >
          {/* Chip mascot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chipBase64}
              alt="Chip"
              width={280}
              height={317}
              style={{
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.2))",
              }}
            />
          </div>

          {/* Text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                display: "flex",
              }}
            >
              TinkerSchool
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                display: "flex",
              }}
            >
              Where every kid is a genius waiting to bloom
            </div>

            {/* Subject pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {["Math", "Reading", "Science", "Music", "Art", "Coding"].map(
                (name) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {name}
                  </div>
                )
              )}
            </div>

            {/* URL */}
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                marginTop: 8,
                display: "flex",
              }}
            >
              tinkerschool.ai
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: nunitoFont
        ? [
            {
              name: "Nunito",
              data: nunitoFont,
              style: "normal" as const,
              weight: 700 as const,
            },
          ]
        : undefined,
    }
  );
}
