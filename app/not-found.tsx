import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Head back to TinkerSchool to explore AI-powered learning for kids.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
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
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          Chip looked everywhere but couldn&apos;t find this page!
        </p>
      </div>
      <Button asChild size="lg" className="gap-2 rounded-xl">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to TinkerSchool
        </Link>
      </Button>
    </div>
  );
}
