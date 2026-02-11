"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 rounded-xl print:hidden"
      onClick={() => window.print()}
    >
      <Printer className="size-4" />
      Print Report
    </Button>
  );
}
