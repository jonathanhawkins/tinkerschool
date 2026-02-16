/**
 * Detects which programming concepts a lesson uses based on its hints,
 * starter blocks XML, and solution code.
 *
 * This is a pure utility function that runs on both server and client.
 */

export function detectConceptsForLesson(
  hints: Array<{ text: string }>,
  starterBlocksXml: string | null,
  solutionCode: string | null,
): string[] {
  const detectedConcepts = new Set<string>();

  // Combine all text sources for keyword matching
  const allText = [
    ...hints.map((h) => h.text),
    starterBlocksXml ?? "",
    solutionCode ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (
    allText.includes("display") ||
    allText.includes("screen") ||
    allText.includes("text") ||
    allText.includes("m5_display")
  ) {
    detectedConcepts.add("display");
  }
  if (
    allText.includes("buzzer") ||
    allText.includes("tone") ||
    allText.includes("sound") ||
    allText.includes("m5_buzzer")
  ) {
    detectedConcepts.add("sound");
  }
  if (
    allText.includes("loop") ||
    allText.includes("repeat") ||
    allText.includes("controls_repeat")
  ) {
    detectedConcepts.add("loops");
  }
  if (
    /\bif\b/.test(allText) ||
    allText.includes("logic") ||
    allText.includes("controls_if")
  ) {
    detectedConcepts.add("logic");
  }
  if (
    allText.includes("variable") ||
    allText.includes("variables_set")
  ) {
    detectedConcepts.add("variables");
  }
  if (
    allText.includes("wait") ||
    allText.includes("sleep") ||
    allText.includes("m5_wait")
  ) {
    detectedConcepts.add("wait");
  }
  if (
    allText.includes("button") ||
    allText.includes("pressed") ||
    allText.includes("m5_button")
  ) {
    detectedConcepts.add("buttons");
  }

  // Always include display for first lessons if nothing detected
  if (detectedConcepts.size === 0) {
    detectedConcepts.add("display");
  }

  return Array.from(detectedConcepts);
}
