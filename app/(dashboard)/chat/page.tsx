import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Chat with Chip" };
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  MessageCircle,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn, Stagger, StaggerItem, HoverLift } from "@/components/motion";
import type { Subject } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Icon mapping
// ---------------------------------------------------------------------------

function SubjectIcon({
  icon,
  className,
  style,
}: {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const props = { className, style };
  switch (icon) {
    case "calculator":
      return <Calculator {...props} />;
    case "book-open":
      return <BookOpen {...props} />;
    case "flask-conical":
      return <FlaskConical {...props} />;
    case "music":
      return <Music {...props} />;
    case "palette":
      return <Palette {...props} />;
    case "puzzle":
      return <Puzzle {...props} />;
    case "code-2":
      return <Code2 {...props} />;
    default:
      return <BookOpen {...props} />;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ChatPickerPage() {
  const { supabase } = await requireAuth();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("sort_order");

  const safeSubjects: Subject[] = (subjects as Subject[] | null) ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <FadeIn>
        <header className="space-y-2 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircle className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Chat with Chip
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick a subject to start chatting! Chip can help with any topic.
          </p>
        </header>
      </FadeIn>

      <Stagger className="grid gap-3 sm:grid-cols-2">
        {safeSubjects.map((subject) => (
          <StaggerItem key={subject.id}>
            <HoverLift>
              <Link href={`/chat/${subject.slug}`} className="block">
                <Card
                  className="rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: `${subject.color}14`,
                    borderLeftWidth: "4px",
                    borderLeftColor: subject.color,
                  }}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${subject.color}1F` }}
                    >
                      <SubjectIcon
                        icon={subject.icon}
                        className="size-6"
                        style={{ color: subject.color }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: subject.color }}
                      >
                        {subject.display_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Chat about {subject.display_name.toLowerCase()} with Chip
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>

      {/* ----- Empty state ----- */}
      {safeSubjects.length === 0 && (
        <Card className="rounded-2xl py-12 text-center">
          <CardContent className="flex flex-col items-center gap-3">
            <MessageCircle className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No subjects available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
