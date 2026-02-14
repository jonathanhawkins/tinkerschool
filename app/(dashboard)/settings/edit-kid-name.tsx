"use client";

import { useState, useTransition } from "react";
import { Pencil, Loader2 } from "lucide-react";

import { updateKidName } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditKidNameProps {
  kidId: string;
  currentName: string;
}

export function EditKidName({ kidId, currentName }: EditKidNameProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      // Reset state when opening
      setName(currentName);
      setError(null);
    }
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }
    if (trimmed === currentName) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await updateKidName(kidId, trimmed);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Failed to update name.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={`Edit ${currentName}'s name`}
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Learner Name</DialogTitle>
          <DialogDescription>
            Change the display name for this learner profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            placeholder="Learner name"
            maxLength={30}
            autoFocus
            className="rounded-lg"
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
