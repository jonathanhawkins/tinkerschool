"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <Image
        src="/images/chip.png"
        alt="Chip"
        width={100}
        height={100}
        className="opacity-60"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Oops, something broke!
        </h1>
        <p className="text-sm text-muted-foreground">
          Don&apos;t worry — even robots have bad days. Let&apos;s try again.
        </p>
      </div>
      <Button onClick={reset} size="lg" className="gap-2 rounded-xl">
        <RotateCcw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
