import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Firmware Browser",
  robots: { index: false, follow: false },
};

import { requireAuth } from "@/lib/auth/require-auth";
import { fetchFirmwareCatalog } from "@/lib/firmware/catalog";

import FirmwareBrowser from "./firmware-browser";

export default async function FirmwarePage() {
  await requireAuth();

  const catalog = await fetchFirmwareCatalog();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/setup"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Setup
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          Firmware Versions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and flash different UIFlow2 firmware versions for your M5StickC
          Plus 2. The recommended version is pre-selected.
        </p>
      </div>

      <FirmwareBrowser catalog={catalog} />
    </div>
  );
}
