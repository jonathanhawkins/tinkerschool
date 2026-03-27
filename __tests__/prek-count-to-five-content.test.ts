import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("Pre-K Count to Five lesson seed fix", () => {
  it("starts with 5 and saves the 4-count prompt for the third question", () => {
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/080_fix_prek_count_to_five_question_order.sql",
    );
    const migration = fs.readFileSync(migrationPath, "utf-8");

    const firstQuestion = migration.indexOf('"id":"c5a"');
    const secondQuestion = migration.indexOf('"id":"c5b"');
    const thirdQuestion = migration.indexOf('"id":"c5c"');

    expect(firstQuestion).toBeGreaterThan(-1);
    expect(secondQuestion).toBeGreaterThan(-1);
    expect(thirdQuestion).toBeGreaterThan(-1);
    expect(firstQuestion).toBeLessThan(secondQuestion);
    expect(secondQuestion).toBeLessThan(thirdQuestion);

    expect(migration).toContain(
      '"id":"c5a","hint":"ONE, TWO, THREE, FOUR, FIVE!","emoji":"⭐","prompt":"How many stars?","correctCount":5,"displayCount":5',
    );
    expect(migration).toContain(
      '"id":"c5b","hint":"ONE, TWO, THREE!","emoji":"🍎","prompt":"How many apples?","correctCount":3,"displayCount":3',
    );
    expect(migration).toContain(
      '"id":"c5c","hint":"ONE, TWO, THREE, FOUR!","emoji":"🦋","prompt":"How many butterflies?","correctCount":4,"displayCount":4',
    );
  });
});
