import { describe, it, expect } from "vitest";

import { getChipSystemPrompt } from "./chip-system-prompt";
import type { ChipContext } from "./chip-system-prompt";

describe("getChipSystemPrompt", () => {
  const baseParams: ChipContext = {
    childName: "Cassidy",
    age: 7,
    gradeLevel: 2,
  };

  it("returns a non-empty string", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result.length).toBeGreaterThan(0);
  });

  it("contains the child's name", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("Cassidy");
  });

  it("contains the child's age", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("age 7");
  });

  it("contains the grade level", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("grade 2");
  });

  it("contains the band name derived from grade level", () => {
    const result = getChipSystemPrompt(baseParams);
    expect(result).toContain("Builder");
  });

  it("uses correct band names for all grade levels", () => {
    const gradeToExpectedBand: Record<number, string> = {
      0: "Explorer",
      1: "Explorer",
      2: "Builder",
      3: "Inventor",
      4: "Hacker",
      5: "Creator",
      6: "Creator",
    };

    for (const [grade, expectedBand] of Object.entries(gradeToExpectedBand)) {
      const result = getChipSystemPrompt({
        childName: "Test",
        age: 7,
        gradeLevel: Number(grade),
      });
      expect(result).toContain(expectedBand);
    }
  });

  describe("language complexity by age/gradeLevel", () => {
    it("uses very simple language for age 5 / grade 1", () => {
      const result = getChipSystemPrompt({
        childName: "Leo",
        age: 5,
        gradeLevel: 1,
      });

      expect(result).toContain("very simple words");
      expect(result).toContain("1-2 short sentences");
    });

    it("uses 2nd grader language for age 7 / grade 2", () => {
      const result = getChipSystemPrompt({
        childName: "Cassidy",
        age: 7,
        gradeLevel: 2,
      });

      expect(result).toContain("2nd grader");
      expect(result).toContain("2-3 sentences");
    });

    it("uses 3rd-4th grader language for age 9 / grade 3", () => {
      const result = getChipSystemPrompt({
        childName: "Alex",
        age: 9,
        gradeLevel: 3,
      });

      expect(result).toContain("3rd-4th grader");
    });

    it("uses 4th-5th grader language for age 10 / grade 4", () => {
      const result = getChipSystemPrompt({
        childName: "Sam",
        age: 10,
        gradeLevel: 4,
      });

      expect(result).toContain("4th-5th grader");
    });

    it("uses 5th-6th grader language for age 12 / grade 5", () => {
      const result = getChipSystemPrompt({
        childName: "Jordan",
        age: 12,
        gradeLevel: 5,
      });

      expect(result).toContain("5th-6th grader");
    });

    it("includes question requirement in language guidance for all ages", () => {
      // Younger kids: questions should be simple
      const young = getChipSystemPrompt({
        childName: "Leo",
        age: 5,
        gradeLevel: 1,
      });
      expect(young).toContain("question");

      // Older kids: questions should push deeper thinking
      const older = getChipSystemPrompt({
        childName: "Jordan",
        age: 12,
        gradeLevel: 5,
      });
      expect(older).toContain("question");
    });
  });

  describe("Socratic Teaching Method", () => {
    it("includes the Socratic Teaching Method section", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Socratic Teaching Method");
      expect(result).toContain("YOUR MOST IMPORTANT RULE");
    });

    it("includes the Golden Rule about always asking questions", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Golden Rule");
      expect(result).toContain(
        "MUST contain at least one question"
      );
    });

    it("includes the Discovery Loop pattern", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Discovery Loop");
      expect(result).toContain("ACKNOWLEDGE");
      expect(result).toContain("QUESTION");
      expect(result).toContain("WAIT");
    });

    it("includes question escalation strategy", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Question Escalation");
      expect(result).toContain("Yes/No questions");
      expect(result).toContain("Choice questions");
      expect(result).toContain("Observation questions");
      expect(result).toContain("Reasoning questions");
      expect(result).toContain("Tiny hint + question");
    });

    it("includes guidance for when kids ask for the answer", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Just Tell Me the Answer");
      expect(result).toContain("NEVER give in");
      expect(result).toContain("Make it smaller");
    });

    it("includes thinking scaffolds", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Thinking Scaffolds");
      expect(result).toContain("Break it down");
      expect(result).toContain("Make it concrete");
      expect(result).toContain("Connect to known");
      expect(result).toContain("Eliminate options");
    });

    it("includes frustration detection guidance", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Frustration Detection");
      expect(result).toContain("idk");
      expect(result).toContain("I can't do it");
    });
  });

  describe("Prohibited Response Patterns", () => {
    it("includes the prohibited patterns section", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Prohibited Response Patterns");
      expect(result).toContain("NEVER DO THESE");
    });

    it("includes direct answer prohibition with examples", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Direct Answers");
      expect(result).toContain("BAD:");
      expect(result).toContain("GOOD:");
    });

    it("includes complete explanation prohibition", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Complete Explanations");
    });

    it("includes code writing prohibition", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Writing Code or Solving Problems");
    });

    it("includes correcting without questioning prohibition", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Correcting Without Questioning");
    });

    it("includes long lecture prohibition", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Long Lectures");
    });
  });

  describe("subject-specific guidance", () => {
    it("includes math guidance when subject is math", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "math",
      });

      expect(result).toContain("Subject: Math");
      expect(result).toContain("concrete objects");
      expect(result).toContain("Socratic Questions for Math");
      expect(result).toContain("NEVER Do This in Math");
    });

    it("includes reading guidance when subject is reading", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "reading",
      });

      expect(result).toContain("Subject: Reading");
      expect(result).toContain("Sound out words");
      expect(result).toContain("phonics");
      expect(result).toContain("Socratic Questions for Reading");
      expect(result).toContain("NEVER Do This in Reading");
    });

    it("includes science guidance when subject is science", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "science",
      });

      expect(result).toContain("Subject: Science");
      expect(result).toContain("What do you notice");
      expect(result).toContain("What do you think will happen");
      expect(result).toContain("Socratic Questions for Science");
      expect(result).toContain("NEVER Do This in Science");
    });

    it("includes music guidance when subject is music", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "music",
      });

      expect(result).toContain("Subject: Music");
      expect(result).toContain("rhythm");
      expect(result).toContain("buzzer");
      expect(result).toContain("Socratic Questions for Music");
      expect(result).toContain("NEVER Do This in Music");
    });

    it("includes art guidance when subject is art", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "art",
      });

      expect(result).toContain("Subject: Art");
      expect(result).toContain("no wrong answer");
      expect(result).toContain("color");
      expect(result).toContain("Socratic Questions for Art");
      expect(result).toContain("NEVER Do This in Art");
    });

    it("includes problem solving guidance when subject is problem_solving", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "problem_solving",
      });

      expect(result).toContain("Subject: Problem Solving");
      expect(result).toContain("What's the first step");
      expect(result).toContain("Do you see a pattern");
      expect(result).toContain("Socratic Questions for Problem Solving");
      expect(result).toContain("NEVER Do This in Problem Solving");
    });

    it("includes coding guidance when subject is coding", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "coding",
      });

      expect(result).toContain("Subject: Coding");
      expect(result).toContain("hints, not solutions");
      expect(result).toContain("Celebrate debugging");
      expect(result).toContain("Socratic Questions for Coding");
      expect(result).toContain("NEVER Do This in Coding");
    });

    it("omits subject section when no subject is provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("## Subject:");
    });

    it("uses subject display name in intro", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "problem_solving",
      });

      expect(result).toContain("learn Problem Solving");
    });

    it("falls back to problem_solving guidance for unknown subjects", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentSubject: "underwater_basket_weaving",
      });

      expect(result).toContain("Subject: Problem Solving");
    });

    it("every subject includes Socratic questions and NEVER-do sections", () => {
      const subjects = [
        "math",
        "reading",
        "science",
        "music",
        "art",
        "problem_solving",
        "coding",
      ];

      for (const subject of subjects) {
        const result = getChipSystemPrompt({
          ...baseParams,
          currentSubject: subject,
        });

        const displayName =
          subject === "problem_solving" ? "Problem Solving" : subject.charAt(0).toUpperCase() + subject.slice(1);

        expect(result).toContain(`Socratic Questions for ${displayName}`);
        expect(result).toContain(`NEVER Do This in ${displayName}`);
      }
    });
  });

  describe("learning style adaptation", () => {
    it("adapts for visual learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.5,
            auditory: 0.2,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Learning Style Adaptation");
      expect(result).toContain("VISUALLY");
      expect(result).toContain("picture this");
    });

    it("adapts for auditory learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.6,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("LISTENING and SOUND");
      expect(result).toContain("listen to this");
    });

    it("adapts for kinesthetic learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.1,
            kinesthetic: 0.7,
            reading_writing: 0.1,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("DOING and MOVING");
      expect(result).toContain("Try shaking it");
    });

    it("adapts for reading/writing learners", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: {
            visual: 0.1,
            auditory: 0.1,
            kinesthetic: 0.1,
            reading_writing: 0.7,
          },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("READING and WRITING");
      expect(result).toContain("written words");
    });

    it("omits learning style section when no profile is provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("Learning Style Adaptation");
    });

    it("includes Socratic question framing for each learning style", () => {
      const styles: { style: Record<string, number>; expected: string }[] = [
        { style: { visual: 1 }, expected: "Can you picture" },
        { style: { auditory: 1 }, expected: "Can you say that out loud" },
        { style: { kinesthetic: 1 }, expected: "Can you show me" },
        { style: { reading_writing: 1 }, expected: "wrote that as a list" },
      ];

      for (const { style, expected } of styles) {
        const result = getChipSystemPrompt({
          ...baseParams,
          learningProfile: {
            learningStyle: style,
            interests: [],
            preferredEncouragement: "enthusiastic",
            chipNotes: "",
          },
        });

        expect(result).toContain(expected);
      }
    });
  });

  describe("encouragement style", () => {
    it("uses enthusiastic encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Encouragement Style");
      expect(result).toContain("SUPERSTAR");
    });

    it("uses quiet encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "quiet",
          chipNotes: "",
        },
      });

      expect(result).toContain("calm, warm encouragement");
    });

    it("uses humor encouragement when preferred", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "humor",
          chipNotes: "",
        },
      });

      expect(result).toContain("silly jokes");
    });

    it("all encouragement styles celebrate thinking over correctness", () => {
      for (const pref of ["enthusiastic", "quiet", "humor"]) {
        const result = getChipSystemPrompt({
          ...baseParams,
          learningProfile: {
            learningStyle: { visual: 1 },
            interests: [],
            preferredEncouragement: pref,
            chipNotes: "",
          },
        });

        // Each style should celebrate the thinking process
        expect(result).toContain("thinking");
      }
    });
  });

  describe("interest weaving", () => {
    it("includes interests when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: ["dinosaurs", "space", "animals"],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).toContain("Weave In Their Interests");
      expect(result).toContain("dinosaurs");
      expect(result).toContain("space");
      expect(result).toContain("animals");
    });

    it("omits interest section when interests are empty", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).not.toContain("Weave In Their Interests");
    });

    it("omits interest section when no profile", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Weave In Their Interests");
    });

    it("frames interest examples as questions, not statements", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: ["dinosaurs"],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      // Interest examples should contain question marks
      expect(result).toContain("Socratic questions");
    });
  });

  describe("skill proficiency", () => {
    it("groups skills by proficiency level", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          addition: "mastered",
          subtraction: "proficient",
          multiplication: "developing",
          division: "beginning",
          fractions: "not_started",
        },
      });

      expect(result).toContain("Skill Awareness");
      expect(result).toContain("Strong skills");
      expect(result).toContain("addition");
      expect(result).toContain("subtraction");
      expect(result).toContain("Developing skills");
      expect(result).toContain("multiplication");
      expect(result).toContain("Beginning skills");
      expect(result).toContain("division");
    });

    it("converts underscored skill slugs to readable names", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          two_digit_addition: "developing",
        },
      });

      expect(result).toContain("two digit addition");
    });

    it("omits skill section when no proficiency data", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Skill Awareness");
    });

    it("omits skill section when all skills are not_started", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          addition: "not_started",
          subtraction: "not_started",
        },
      });

      expect(result).not.toContain("Skill Awareness");
    });

    it("includes teaching strategy guidance for each proficiency level", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        skillProficiency: {
          addition: "mastered",
          subtraction: "developing",
          division: "beginning",
        },
      });

      // Strong skills: used as building blocks
      expect(result).toContain("building blocks");
      // Developing: ask them to teach back
      expect(result).toContain("teach YOU");
      // Beginning: extra scaffolding
      expect(result).toContain("extra scaffolding");
    });
  });

  describe("recent lessons", () => {
    it("includes recent lessons when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        recentLessons: ["Counting to 20", "Addition with Pictures", "Shapes"],
      });

      expect(result).toContain("Recent Lessons Completed");
      expect(result).toContain("Counting to 20");
      expect(result).toContain("Addition with Pictures");
      expect(result).toContain("Shapes");
    });

    it("omits recent lessons section when not provided", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).not.toContain("Recent Lessons Completed");
    });

    it("omits recent lessons section when empty array", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        recentLessons: [],
      });
      expect(result).not.toContain("Recent Lessons Completed");
    });

    it("suggests using past successes as confidence builders", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        recentLessons: ["Counting to 20"],
      });

      expect(result).toContain("confidence builders");
    });
  });

  describe("chip notes", () => {
    it("includes chip notes when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes:
            "Cassidy gets frustrated with word problems. Use extra patience and break into smaller steps.",
        },
      });

      expect(result).toContain("Your Notes About This Child");
      expect(result).toContain("gets frustrated with word problems");
    });

    it("omits chip notes when empty", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        learningProfile: {
          learningStyle: { visual: 1 },
          interests: [],
          preferredEncouragement: "enthusiastic",
          chipNotes: "",
        },
      });

      expect(result).not.toContain("Your Notes About This Child");
    });
  });

  describe("lesson context", () => {
    it("includes lesson context when provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentLesson: "Blinking LED",
      });

      expect(result).toContain("Blinking LED");
      expect(result).toContain("Current Context");
    });

    it("enforces no spoilers for lessons", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentLesson: "Addition Fun",
      });

      expect(result).toContain("WITHOUT giving away the solution");
      expect(result).toContain("NEVER summarize");
    });

    it("omits lesson context when not provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("Current Context");
    });
  });

  describe("code context", () => {
    it("includes code context when provided", () => {
      const code = 'M5.Lcd.drawString("Hi", 10, 20)';
      const result = getChipSystemPrompt({
        ...baseParams,
        currentCode: code,
      });

      expect(result).toContain(code);
      expect(result).toContain("```python");
      expect(result).toContain("Current Context");
    });

    it("enforces asking about code before helping", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentCode: "print('hello')",
      });

      expect(result).toContain(
        "ask them what they think each line does FIRST"
      );
      expect(result).toContain("NEVER rewrite their code");
    });

    it("omits code context when not provided", () => {
      const result = getChipSystemPrompt(baseParams);

      expect(result).not.toContain("```python");
    });
  });

  describe("both lesson and code context", () => {
    it("includes both when both are provided", () => {
      const result = getChipSystemPrompt({
        ...baseParams,
        currentLesson: "Display Fun",
        currentCode: "print('hello')",
      });

      expect(result).toContain("Display Fun");
      expect(result).toContain("print('hello')");
    });
  });

  describe("cross-subject connections", () => {
    it("includes cross-subject connection guidance", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Cross-Subject Connections");
      expect(result).toContain(
        "connect what the child is learning to other subjects"
      );
    });
  });

  describe("M5StickC Plus 2 multi-subject features", () => {
    it("describes display for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("flashcards");
      expect(result).toContain("number lines");
    });

    it("describes buzzer for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("phonics sounds");
      expect(result).toContain("musical notes");
    });

    it("describes buttons for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("answer choices");
    });

    it("describes IMU for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("tilt to sort");
      expect(result).toContain("shake to shuffle");
    });

    it("describes LED for multi-subject use", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("even/odd indicator");
      expect(result).toContain("beat pulse");
    });
  });

  describe("safety guardrails", () => {
    it("includes the rule about not giving complete answers as the most important rule", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("NEVER give complete answers");
      expect(result).toContain("most important rule");
    });

    it("includes expanded topic allowances for all subjects", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("all school subjects");
      expect(result).toContain("math");
      expect(result).toContain("reading");
      expect(result).toContain("science");
    });

    it("includes the off-topic redirection guidance", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("get back to our");
    });

    it("includes the rule about keeping responses short", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("Keep responses SHORT");
    });

    it("includes encouragement for all kids", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain(
        "every child learns at their own pace"
      );
    });
  });

  describe("personality", () => {
    it("identifies itself as Chip", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("You are Chip");
    });

    it("describes a friendly robot learning buddy persona", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("friendly robot learning buddy");
    });

    it("mentions the M5StickC Plus 2 device", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("M5StickC Plus 2");
    });

    it("mentions TinkerSchool", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("TinkerSchool");
    });

    it("describes Chip as curious and question-asking", () => {
      const result = getChipSystemPrompt(baseParams);
      expect(result).toContain("CURIOUS");
      expect(result).toContain("want to know what THEY think");
    });
  });

  describe("never-give-answers reinforcement", () => {
    it("reinforces the no-answers rule in the closing statement", () => {
      const result = getChipSystemPrompt(baseParams);
      // The closing line should emphasize questioning
      expect(result).toContain("NEVER give answers");
      expect(result).toContain("RIGHT QUESTIONS");
      expect(result).toContain("discover answers on their own");
    });

    it("the no-answers principle appears multiple times throughout the prompt", () => {
      const result = getChipSystemPrompt(baseParams);

      // Count occurrences of key phrases that reinforce the principle
      const neverGivePattern = /NEVER give|NEVER DO|never give/g;
      const matches = result.match(neverGivePattern);

      // Should appear at least 3 times across different sections
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("full integration", () => {
    it("generates a complete prompt with all optional fields", () => {
      const result = getChipSystemPrompt({
        childName: "Cassidy",
        age: 7,
        gradeLevel: 2,
        currentSubject: "math",
        currentLesson: "Addition with Pictures",
        currentCode: "count = 3 + 4",
        learningProfile: {
          learningStyle: {
            visual: 0.4,
            auditory: 0.3,
            kinesthetic: 0.2,
            reading_writing: 0.1,
          },
          interests: ["dinosaurs", "space"],
          preferredEncouragement: "enthusiastic",
          chipNotes: "Loves counting games. Gets frustrated with word problems.",
        },
        skillProficiency: {
          counting: "mastered",
          addition: "developing",
          subtraction: "beginning",
        },
        recentLessons: ["Counting to 20", "Number Lines"],
      });

      // Core identity
      expect(result).toContain("You are Chip");
      expect(result).toContain("Cassidy");
      expect(result).toContain("age 7");
      expect(result).toContain("grade 2");

      // Subject
      expect(result).toContain("Subject: Math");
      expect(result).toContain("learn Math");

      // Socratic framework
      expect(result).toContain("Socratic Teaching Method");
      expect(result).toContain("Prohibited Response Patterns");
      expect(result).toContain("Socratic Questions for Math");

      // Learning style
      expect(result).toContain("VISUALLY");

      // Encouragement
      expect(result).toContain("SUPERSTAR");

      // Interests
      expect(result).toContain("dinosaurs");
      expect(result).toContain("space");

      // Skills
      expect(result).toContain("counting");
      expect(result).toContain("addition");
      expect(result).toContain("subtraction");

      // Recent lessons
      expect(result).toContain("Counting to 20");
      expect(result).toContain("Number Lines");

      // Chip notes
      expect(result).toContain("Loves counting games");

      // Context
      expect(result).toContain("Addition with Pictures");
      expect(result).toContain("count = 3 + 4");

      // Cross-subject connections
      expect(result).toContain("Cross-Subject Connections");

      // Safety rules
      expect(result).toContain("NEVER give complete answers");
    });

    it("generates a minimal prompt with only required fields", () => {
      const result = getChipSystemPrompt({
        childName: "Test",
        age: 8,
        gradeLevel: 3,
      });

      expect(result).toContain("You are Chip");
      expect(result).toContain("Test");
      expect(result).toContain("age 8");
      expect(result).toContain("grade 3");
      expect(result).toContain("learn learning");

      // Socratic framework should ALWAYS be present
      expect(result).toContain("Socratic Teaching Method");
      expect(result).toContain("Prohibited Response Patterns");

      // Optional sections should be absent
      expect(result).not.toContain("Subject:");
      expect(result).not.toContain("Learning Style Adaptation");
      expect(result).not.toContain("Encouragement Style");
      expect(result).not.toContain("Weave In Their Interests");
      expect(result).not.toContain("Skill Awareness");
      expect(result).not.toContain("Recent Lessons Completed");
      expect(result).not.toContain("Your Notes About This Child");
      expect(result).not.toContain("Current Context");
    });

    it("even the minimal prompt enforces questioning behavior", () => {
      const result = getChipSystemPrompt({
        childName: "Test",
        age: 8,
        gradeLevel: 3,
      });

      // Even without any optional data, the prompt should enforce:
      expect(result).toContain("MUST contain at least one question");
      expect(result).toContain("NEVER give answers");
      expect(result).toContain("Discovery Loop");
      expect(result).toContain("Thinking Scaffolds");
    });
  });
});
