import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Gallery" };
import { FolderOpen, Wrench } from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import type { Project } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectCard from "./project-card";

export const revalidate = 60;

export default async function GalleryPage() {
  const { profile, supabase } = await requireAuth();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("family_id", profile.family_id)
    .order("updated_at", { ascending: false });

  const safeProjects = (projects ?? []) as Project[];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">My Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All the awesome projects you have built so far!
          </p>
        </div>
      </FadeIn>

      {/* Projects grid or empty state */}
      {safeProjects.length === 0 ? (
        <EmptyGallery />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeProjects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyGallery() {
  return (
    <Card className="mx-auto max-w-md rounded-2xl border-dashed py-12 text-center">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <FolderOpen className="size-8 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-foreground">
            No projects yet!
          </p>
          <p className="text-sm text-muted-foreground">
            Head to the Workshop to create your first masterpiece.
          </p>
        </div>
        <Button asChild className="mt-2 gap-2 rounded-xl">
          <Link href="/workshop">
            <Wrench className="size-4" />
            Go to Workshop
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
