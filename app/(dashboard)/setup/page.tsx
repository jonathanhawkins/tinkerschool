import { Package } from "lucide-react";
import Link from "next/link";

import { requireAuth } from "@/lib/auth/require-auth";

import SetupContent from "./setup-content";

export default async function SetupPage() {
  await requireAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Device Setup
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flash MicroPython firmware to your M5StickC Plus 2 so you can upload
          code from the Workshop.
        </p>
      </div>

      <SetupContent />

      {/* Link to firmware browser for advanced users */}
      <div className="mt-8 rounded-2xl border border-dashed p-4 text-center">
        <Link
          href="/setup/firmware"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Package className="size-4" />
          Browse other firmware versions
        </Link>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Flash older or newer UIFlow2 releases from the M5Stack GitHub repository
        </p>
      </div>
    </div>
  );
}
