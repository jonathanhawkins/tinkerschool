import type { SimulatorOutput } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// Parse expected output from MicroPython solution code
// ---------------------------------------------------------------------------

/** Extract drawString text literals from MicroPython solution code */
export function parseExpectedOutput(solutionCode: string): string[] {
  const lines: string[] = [];

  // Match Lcd.drawString("text", ...) with double quotes
  const doubleQuoteRegex = /Lcd\.drawString\(\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = doubleQuoteRegex.exec(solutionCode)) !== null) {
    if (match[1]) lines.push(match[1]);
  }

  // Match Lcd.drawString('text', ...) with single quotes
  const singleQuoteRegex = /Lcd\.drawString\(\s*'([^']+)'/g;
  while ((match = singleQuoteRegex.exec(solutionCode)) !== null) {
    if (match[1]) lines.push(match[1]);
  }

  // Deduplicate
  return [...new Set(lines)];
}

/** Check if solution code uses the buzzer (Speaker.tone) */
export function usesBuzzer(solutionCode: string): boolean {
  return /Speaker\.tone/.test(solutionCode);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  passed: boolean;
  feedback: string;
}

/**
 * Compare actual simulator output against expected output from the lesson's
 * solution code. Returns a kid-friendly feedback message.
 *
 * Matching rules:
 * - Text comparison is case-insensitive and order-insensitive
 * - All expected static texts must appear in actual output
 * - If solution uses buzzer, actual must too
 * - Dynamic texts (str(variable)) are ignored since they depend on runtime
 */
export function validateLessonOutput(
  actual: SimulatorOutput,
  solutionCode: string,
): ValidationResult {
  const expectedTexts = parseExpectedOutput(solutionCode);
  const expectedBuzzer = usesBuzzer(solutionCode);

  // If solution has no static text expectations (all dynamic), pass on run alone
  if (expectedTexts.length === 0 && !expectedBuzzer) {
    return { passed: true, feedback: "Great job running your code!" };
  }

  // Build a set of actual texts (lowercased for fuzzy matching)
  const actualSet = new Set(actual.texts.map((t) => t.toLowerCase().trim()));

  // Check each expected text
  const missing: string[] = [];
  for (const expected of expectedTexts) {
    if (!actualSet.has(expected.toLowerCase().trim())) {
      missing.push(expected);
    }
  }

  if (missing.length > 0) {
    // Show at most 2 missing items to avoid overwhelming the kid
    const shown = missing.slice(0, 2);
    const hint =
      shown.length === 1
        ? `Your screen should show: "${shown[0]}"`
        : `Your screen should show: "${shown[0]}" and "${shown[1]}"`;
    return { passed: false, feedback: hint };
  }

  // Check buzzer requirement
  if (expectedBuzzer && !actual.hasBuzzer) {
    return {
      passed: false,
      feedback: "Almost there! Don't forget to add sound with the buzzer!",
    };
  }

  return { passed: true, feedback: "Perfect! Your code matches the goal!" };
}
