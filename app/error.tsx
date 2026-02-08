"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Image
        src="/images/chip.png"
        alt="Chip"
        width={120}
        height={120}
        className="opacity-60"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Oops, something broke!
        </h1>
        <p className="text-muted-foreground">
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
