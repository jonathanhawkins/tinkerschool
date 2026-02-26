"use client";

import { useState, useTransition } from "react";
import { Pencil, Loader2, GraduationCap } from "lucide-react";

import { updateKidGrade } from "./actions";
import { bandForGrade, BAND_NAMES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GRADE_OPTIONS = [
  { value: "-1", label: "Pre-K", ages: "3-5" },
  { value: "0", label: "Kindergarten", ages: "5-6" },
  { value: "1", label: "1st Grade", ages: "6-7" },
  { value: "2", label: "2nd Grade", ages: "7-8" },
  { value: "3", label: "3rd Grade", ages: "8-9" },
  { value: "4", label: "4th Grade", ages: "9-10" },
  { value: "5", label: "5th Grade", ages: "10-11" },
  { value: "6", label: "6th Grade", ages: "11-12" },
];

interface EditKidGradeProps {
  kidId: string;
  currentGrade: number | null;
  kidName: string;
}

export function EditKidGrade({ kidId, currentGrade, kidName }: EditKidGradeProps) {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState(String(currentGrade ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedGrade = GRADE_OPTIONS.find((g) => g.value === grade);
  const newBand = grade !== "" ? bandForGrade(parseInt(grade, 10)) : null;
  const currentBand = currentGrade !== null ? bandForGrade(currentGrade) : null;
  const bandChanged = newBand !== null && newBand !== currentBand;

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      setGrade(String(currentGrade ?? ""));
      setError(null);
    }
  }

  function handleSave() {
    if (grade === "") {
      setError("Please select a grade level.");
      return;
    }

    const gradeNum = parseInt(grade, 10);
    if (gradeNum === currentGrade) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await updateKidGrade(kidId, gradeNum);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Failed to update grade level.");
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
          aria-label={`Change ${kidName}'s grade level`}
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            Change Grade Level
          </DialogTitle>
          <DialogDescription>
            Update {kidName}&apos;s grade level. This adjusts the curriculum
            difficulty and content shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Select value={grade} onValueChange={(v) => { setGrade(v); setError(null); }}>
            <SelectTrigger className="h-11 w-full rounded-xl text-base">
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} (ages {option.ages})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Show band change notice */}
          {bandChanged && newBand && (
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 dark:bg-amber-950/30">
              <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                This will also change {kidName}&apos;s learning band to{" "}
                <span className="font-semibold">
                  Band {newBand} ({BAND_NAMES[newBand]})
                </span>
                , which adjusts the coding difficulty level.
              </p>
            </div>
          )}

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
            disabled={isPending || grade === ""}
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
