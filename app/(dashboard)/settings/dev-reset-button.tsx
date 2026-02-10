"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { resetProgress } from "./actions";

export function DevResetButton() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const handleReset = useCallback(() => {
    if (!confirm("Reset all progress, badges, XP, and streaks? This can't be undone.")) {
      return;
    }

    setDone(false);
    startTransition(async () => {
      await resetProgress();
      setDone(true);
    });
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="destructive"
        size="sm"
        className="gap-1.5 rounded-xl text-xs"
        onClick={handleReset}
        disabled={isPending}
      >
        <RotateCcw className={`size-3 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Resetting..." : "Reset All Progress"}
      </Button>
      {done && (
        <span className="text-xs font-medium text-emerald-600">
          Done! Reload to see changes.
        </span>
      )}
    </div>
  );
}
