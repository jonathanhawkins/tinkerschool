import Link from "next/link";
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import type { Subject, Skill, SkillProficiency } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";

// ---------------------------------------------------------------------------
// Icon mapping -- resolves a DB icon string to a lucide-react component
// ---------------------------------------------------------------------------

function SubjectIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "calculator":
      return <Calculator className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "flask-conical":
      return <FlaskConical className={className} />;
    case "music":
      return <Music className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "puzzle":
      return <Puzzle className={className} />;
    case "code-2":
      return <Code2 className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

// ---------------------------------------------------------------------------
// Subject Card
// ---------------------------------------------------------------------------

interface SubjectCardProps {
  subject: Subject;
  skillsStarted: number;
  skillsTotal: number;
}

function SubjectCard({ subject, skillsStarted, skillsTotal }: SubjectCardProps) {
  const progressPercent =
    skillsTotal > 0 ? Math.round((skillsStarted / skillsTotal) * 100) : 0;

  return (
    <Link href={`/subjects/${subject.slug}`} className="group block">
      <Card
        className="h-full rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md"
        style={{ borderLeftColor: subject.color }}
      >
        <CardContent className="flex items-start gap-4 pt-6">
          {/* Colored icon circle */}
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: `${subject.color}15` }}
          >
            <span style={{ color: subject.color }}>
              <SubjectIcon icon={subject.icon} className="size-6" />
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {subject.display_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {skillsStarted} of {skillsTotal} skill{skillsTotal !== 1 ? "s" : ""}{" "}
              started
            </p>
          </div>

          <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-1.5 pb-5">
          <ProgressBar
            value={progressPercent}
            className="h-2"
          />
          <p className="text-right text-[11px] font-medium text-muted-foreground">
            {progressPercent}%
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function SubjectsPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch all subjects
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("sort_order");

  const safeSubjects: Subject[] = (subjects as Subject[] | null) ?? [];

  // Fetch kid's skill proficiency with skill details
  const { data: proficiencyRows } = await supabase
    .from("skill_proficiencies")
    .select("*, skills(*)")
    .eq("profile_id", profile.id);

  interface ProficiencyWithSkill extends SkillProficiency {
    skills: Skill;
  }

  const safeProficiency: ProficiencyWithSkill[] =
    (proficiencyRows as ProficiencyWithSkill[] | null) ?? [];

  // Build a set of subject IDs that the kid has started at least one skill in
  const startedBySubject = new Map<string, number>();
  for (const row of safeProficiency) {
    if (row.level !== "not_started" && row.skills) {
      const subjectId = row.skills.subject_id;
      startedBySubject.set(subjectId, (startedBySubject.get(subjectId) ?? 0) + 1);
    }
  }

  // Fetch skill counts per subject
  const { data: skills } = await supabase
    .from("skills")
    .select("id, subject_id")
    .order("sort_order");

  const safeSkills = (skills as Pick<Skill, "id" | "subject_id">[] | null) ?? [];

  // Count total skills per subject
  const totalBySubject = new Map<string, number>();
  for (const skill of safeSkills) {
    totalBySubject.set(
      skill.subject_id,
      (totalBySubject.get(skill.subject_id) ?? 0) + 1,
    );
  }

  return (
    <div className="space-y-8">
      {/* ----- Header ----- */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Explore Subjects
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a subject to start learning!
        </p>
      </header>

      {/* ----- Subject Grid ----- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {safeSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            skillsStarted={startedBySubject.get(subject.id) ?? 0}
            skillsTotal={totalBySubject.get(subject.id) ?? 0}
          />
        ))}
      </div>

      {/* ----- Empty state ----- */}
      {safeSubjects.length === 0 && (
        <Card className="rounded-2xl py-12 text-center">
          <CardContent className="flex flex-col items-center gap-3">
            <BookOpen className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No subjects available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
