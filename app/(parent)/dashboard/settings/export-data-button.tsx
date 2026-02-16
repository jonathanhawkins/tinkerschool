"use client";

import { useState, useTransition } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportChildData } from "./actions";

interface ExportDataButtonProps {
  kidProfileId: string;
  kidName: string;
}

export function ExportDataButton({ kidProfileId, kidName }: ExportDataButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  function handleExport() {
    setError(null);
    setExported(false);

    startTransition(async () => {
      const result = await exportChildData(kidProfileId);

      if (!result.success || !result.data) {
        setError(result.error ?? "Export failed. Please try again.");
        return;
      }

      // Trigger browser download
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tinkerschool-${kidName.toLowerCase().replace(/\s+/g, "-")}-data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExported(true);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleExport}
        disabled={isPending}
        variant={exported ? "outline" : "default"}
        className="w-fit rounded-xl"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Exporting...
          </>
        ) : exported ? (
          <>
            <CheckCircle2 className="size-4 text-emerald-500" />
            Downloaded! Export again
          </>
        ) : (
          <>
            <Download className="size-4" />
            Export {kidName}&apos;s Data
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
