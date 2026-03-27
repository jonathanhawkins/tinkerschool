import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

function readRepoFile(relativePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), relativePath), "utf-8");
}

describe("Lesson content clarity", () => {
  it("keeps counting answers aligned with displayed item counts across migrations", () => {
    const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");
    const migrationFiles = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"));
    const mismatches: Array<{ file: string; correct: number; display: number }> = [];

    for (const file of migrationFiles) {
      const source = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      const regex = /"correctCount"\s*:\s*(\d+)\s*,\s*"displayCount"\s*:\s*(\d+)/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(source))) {
        const correct = Number(match[1]);
        const display = Number(match[2]);
        if (correct !== display) {
          mismatches.push({ file, correct, display });
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("avoids ambiguous square examples in early shape lessons", () => {
    const preKMath = readRepoFile("supabase/migrations/079_redesign_prek_curriculum.sql");
    expect(preKMath).toContain("Circles are round. Squares have four equal sides and four corners!");
    expect(preKMath).toContain('"prompt":"Which one is a square?"');
    expect(preKMath).not.toContain("What shape is a window?");
    expect(preKMath).not.toContain("like a window or a box!");

    const firstGradeArt = readRepoFile("supabase/migrations/024_seed_1st_grade_music_art.sql");
    expect(firstGradeArt).toContain(
      "Think of a cheese cracker or one square on a checkerboard.",
    );
    expect(firstGradeArt).toContain('"prompt": "What shape is a door?"');
    expect(firstGradeArt).not.toContain("Think of a window, a cracker, or a block.");
    expect(firstGradeArt).not.toContain('"prompt": "What shape is a picture frame?"');

    const firstGradeProblemSolving = readRepoFile(
      "supabase/migrations/025_seed_1st_grade_problemsolving_coding.sql",
    );
    expect(firstGradeProblemSolving).toContain(
      '"prompt": "Which shape has 4 equal sides and 4 corners?"',
    );
    expect(firstGradeProblemSolving).not.toContain(
      '"prompt": "A window is usually shaped like a ___."',
    );
  });

  it("includes a live-data migration for the ambiguous shape fixes", () => {
    const liveFixMigration = readRepoFile(
      "supabase/migrations/081_fix_ambiguous_shape_lessons.sql",
    );

    expect(liveFixMigration).toContain("Circles are round. Squares have four equal sides and four corners!");
    expect(liveFixMigration).toContain("b1000005-0002-4000-8000-000000000001");
    expect(liveFixMigration).toContain("b1000006-0005-4000-8000-000000000001");
    expect(liveFixMigration).toContain('"Which one is a square?"');
    expect(liveFixMigration).toContain('"Which shape has 4 equal sides and 4 corners?"');
  });
});
