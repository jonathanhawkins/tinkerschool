"use client";

import Image from "next/image";
import Link from "next/link";
import { RotateCcw, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ParentDashboardError({
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
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          We hit a bump loading the parent dashboard. Please try again.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset} size="lg" className="gap-2 rounded-xl">
          <RotateCcw className="size-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
