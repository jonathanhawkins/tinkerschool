"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Code2,
  MoreVertical,
  Pencil,
  Trash2,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { deleteProject, renameProject } from "@/app/(dashboard)/workshop/actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    python_code: string;
    lesson_id: string | null;
    updated_at: string;
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(project.title);
  const [isPending, startTransition] = useTransition();

  const codePreview = project.python_code.split("\n").slice(0, 4).join("\n");

  function handleDelete() {
    startTransition(async () => {
      await deleteProject(project.id);
      setShowDeleteDialog(false);
    });
  }

  function handleRename() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    startTransition(async () => {
      await renameProject(project.id, trimmed);
      setShowRenameDialog(false);
    });
  }

  return (
    <>
      <Card className="group flex flex-col rounded-2xl transition-shadow hover:shadow-md">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex min-w-0 items-center gap-2 text-base">
              <Code2 className="size-4 shrink-0 text-primary" />
              <span className="truncate">{project.title}</span>
            </CardTitle>

            <div className="flex shrink-0 items-center gap-1">
              {project.lesson_id && (
                <Badge variant="outline" className="text-xs">
                  Lesson
                </Badge>
              )}

              {/* Actions menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Project actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      setNewTitle(project.title);
                      setShowRenameDialog(true);
                    }}
                  >
                    <Pencil className="mr-2 size-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-3">
          <div className="rounded-lg bg-muted/40 p-3">
            <pre
              className={cn(
                "overflow-hidden text-xs leading-relaxed text-muted-foreground",
                "font-mono",
                "line-clamp-4"
              )}
            >
              {codePreview}
            </pre>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Updated {formatDate(project.updated_at)}
          </p>
        </CardContent>

        <CardFooter>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full gap-2 rounded-xl"
          >
            <Link href={`/workshop?projectId=${project.id}`}>
              <Wrench className="size-4" />
              Open in Workshop
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{project.title}&quot;? This
              can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Give your project a new name.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRename();
            }}
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project name"
              maxLength={100}
              autoFocus
              disabled={isPending}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRenameDialog(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !newTitle.trim()}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
