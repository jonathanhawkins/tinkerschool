"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

import { getOrGenerateAdventure } from "@/app/(dashboard)/adventure/actions";

export function DailyAdventureGenerateCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await getOrGenerateAdventure();
      if (result.success && result.adventureId) {
        router.push(`/adventure?id=${result.adventureId}`);
      } else {
        setError(result.error ?? "Something went wrong. Try again!");
      }
    });
  }

  return (
    <Card className="rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-[#EA580C]/5">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
          <Sparkles className="size-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-sm font-semibold text-primary">
            Daily Adventure
          </h3>
          <p className="text-xs text-muted-foreground">
            Chip will create a personalized lesson just for you!
          </p>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
        <Button
          size="lg"
          className="shrink-0 rounded-xl"
          onClick={handleGenerate}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
