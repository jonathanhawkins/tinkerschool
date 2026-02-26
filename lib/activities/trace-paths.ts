// =============================================================================
// Trace Path Data
// =============================================================================
// SVG path data for shapes, uppercase letters, and numbers.
// All paths are normalized to a 200x200 viewBox with generous stroke widths
// suitable for finger tracing by young children.
//
// Each entry includes:
//   - path: SVG path `d` attribute string
//   - checkpoints: array of {x, y} points along the path used for
//     checkpoint-based hit detection (not pixel-perfect tracing)
//   - startPoint: where the pulsing "start here" dot should appear
// =============================================================================

export interface TracePathCheckpoint {
  x: number;
  y: number;
}

export interface TracePathData {
  /** SVG path `d` attribute */
  path: string;
  /** Ordered checkpoints along the path for hit detection */
  checkpoints: TracePathCheckpoint[];
  /** Where the child should start tracing */
  startPoint: TracePathCheckpoint;
}

// ---------------------------------------------------------------------------
// Helper: generate evenly-spaced points along a circle arc
// ---------------------------------------------------------------------------
function circlePoints(
  cx: number,
  cy: number,
  r: number,
  count: number,
  startAngle = -90,
): TracePathCheckpoint[] {
  const points: TracePathCheckpoint[] = [];
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (360 / count) * i;
    const rad = (angle * Math.PI) / 180;
    points.push({
      x: Math.round(cx + r * Math.cos(rad)),
      y: Math.round(cy + r * Math.sin(rad)),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Helper: interpolate points along line segments
// ---------------------------------------------------------------------------
function linePoints(
  segments: Array<[number, number]>,
  pointsPerSegment = 3,
): TracePathCheckpoint[] {
  const points: TracePathCheckpoint[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const [x1, y1] = segments[i];
    const [x2, y2] = segments[i + 1];
    for (let j = 0; j <= pointsPerSegment; j++) {
      // Skip first point on subsequent segments to avoid duplicates
      if (i > 0 && j === 0) continue;
      const t = j / pointsPerSegment;
      points.push({
        x: Math.round(x1 + (x2 - x1) * t),
        y: Math.round(y1 + (y2 - y1) * t),
      });
    }
  }
  return points;
}

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

const circle: TracePathData = {
  path: "M 100 20 A 80 80 0 1 1 99.9 20",
  checkpoints: circlePoints(100, 100, 80, 12),
  startPoint: { x: 100, y: 20 },
};

const square: TracePathData = {
  path: "M 30 30 L 170 30 L 170 170 L 30 170 Z",
  checkpoints: linePoints([
    [30, 30],
    [170, 30],
    [170, 170],
    [30, 170],
    [30, 30],
  ]),
  startPoint: { x: 30, y: 30 },
};

const triangle: TracePathData = {
  path: "M 100 20 L 180 170 L 20 170 Z",
  checkpoints: linePoints([
    [100, 20],
    [180, 170],
    [20, 170],
    [100, 20],
  ]),
  startPoint: { x: 100, y: 20 },
};

// ---------------------------------------------------------------------------
// Uppercase Letters A-Z (simplified single-stroke child-friendly paths)
// ---------------------------------------------------------------------------

const letterA: TracePathData = {
  path: "M 30 180 L 100 20 L 170 180 M 55 120 L 145 120",
  checkpoints: [
    ...linePoints([[30, 180], [100, 20], [170, 180]], 4),
    ...linePoints([[55, 120], [145, 120]], 2),
  ],
  startPoint: { x: 30, y: 180 },
};

const letterB: TracePathData = {
  path: "M 40 20 L 40 180 M 40 20 L 120 20 Q 160 20 160 55 Q 160 90 120 100 L 40 100 M 40 100 L 130 100 Q 170 100 170 140 Q 170 180 130 180 L 40 180",
  checkpoints: [
    ...linePoints([[40, 20], [40, 180]], 4),
    { x: 120, y: 20 }, { x: 160, y: 55 }, { x: 120, y: 100 },
    { x: 130, y: 100 }, { x: 170, y: 140 }, { x: 130, y: 180 }, { x: 40, y: 180 },
  ],
  startPoint: { x: 40, y: 20 },
};

const letterC: TracePathData = {
  path: "M 165 50 Q 165 20 130 20 L 80 20 Q 35 20 35 60 L 35 140 Q 35 180 80 180 L 130 180 Q 165 180 165 150",
  checkpoints: [
    { x: 165, y: 50 }, { x: 145, y: 20 }, { x: 100, y: 20 }, { x: 60, y: 20 },
    { x: 35, y: 50 }, { x: 35, y: 100 }, { x: 35, y: 140 },
    { x: 60, y: 180 }, { x: 100, y: 180 }, { x: 145, y: 180 }, { x: 165, y: 150 },
  ],
  startPoint: { x: 165, y: 50 },
};

const letterD: TracePathData = {
  path: "M 40 20 L 40 180 M 40 20 L 110 20 Q 170 20 170 100 Q 170 180 110 180 L 40 180",
  checkpoints: [
    ...linePoints([[40, 20], [40, 180]], 4),
    { x: 110, y: 20 }, { x: 170, y: 60 }, { x: 170, y: 100 },
    { x: 170, y: 140 }, { x: 110, y: 180 }, { x: 40, y: 180 },
  ],
  startPoint: { x: 40, y: 20 },
};

const letterE: TracePathData = {
  path: "M 160 20 L 40 20 L 40 180 L 160 180 M 40 100 L 130 100",
  checkpoints: [
    ...linePoints([[160, 20], [40, 20], [40, 180], [160, 180]], 3),
    ...linePoints([[40, 100], [130, 100]], 2),
  ],
  startPoint: { x: 160, y: 20 },
};

const letterF: TracePathData = {
  path: "M 160 20 L 40 20 L 40 180 M 40 100 L 130 100",
  checkpoints: [
    ...linePoints([[160, 20], [40, 20], [40, 180]], 3),
    ...linePoints([[40, 100], [130, 100]], 2),
  ],
  startPoint: { x: 160, y: 20 },
};

const letterG: TracePathData = {
  path: "M 165 50 Q 165 20 130 20 L 80 20 Q 35 20 35 60 L 35 140 Q 35 180 80 180 L 130 180 Q 165 180 165 140 L 165 100 L 110 100",
  checkpoints: [
    { x: 165, y: 50 }, { x: 130, y: 20 }, { x: 80, y: 20 },
    { x: 35, y: 50 }, { x: 35, y: 100 }, { x: 35, y: 140 },
    { x: 80, y: 180 }, { x: 130, y: 180 }, { x: 165, y: 140 },
    { x: 165, y: 100 }, { x: 110, y: 100 },
  ],
  startPoint: { x: 165, y: 50 },
};

const letterH: TracePathData = {
  path: "M 40 20 L 40 180 M 160 20 L 160 180 M 40 100 L 160 100",
  checkpoints: [
    ...linePoints([[40, 20], [40, 180]], 3),
    ...linePoints([[160, 20], [160, 180]], 3),
    ...linePoints([[40, 100], [160, 100]], 2),
  ],
  startPoint: { x: 40, y: 20 },
};

const letterI: TracePathData = {
  path: "M 60 20 L 140 20 M 100 20 L 100 180 M 60 180 L 140 180",
  checkpoints: [
    ...linePoints([[60, 20], [140, 20]], 2),
    ...linePoints([[100, 20], [100, 180]], 4),
    ...linePoints([[60, 180], [140, 180]], 2),
  ],
  startPoint: { x: 60, y: 20 },
};

const letterJ: TracePathData = {
  path: "M 60 20 L 160 20 M 120 20 L 120 150 Q 120 180 90 180 L 60 180 Q 40 180 40 150",
  checkpoints: [
    ...linePoints([[60, 20], [160, 20]], 2),
    ...linePoints([[120, 20], [120, 150]], 3),
    { x: 100, y: 180 }, { x: 60, y: 180 }, { x: 40, y: 150 },
  ],
  startPoint: { x: 60, y: 20 },
};

const letterK: TracePathData = {
  path: "M 40 20 L 40 180 M 160 20 L 40 100 L 160 180",
  checkpoints: [
    ...linePoints([[40, 20], [40, 180]], 3),
    ...linePoints([[160, 20], [40, 100], [160, 180]], 3),
  ],
  startPoint: { x: 40, y: 20 },
};

const letterL: TracePathData = {
  path: "M 40 20 L 40 180 L 160 180",
  checkpoints: linePoints([[40, 20], [40, 180], [160, 180]], 3),
  startPoint: { x: 40, y: 20 },
};

const letterM: TracePathData = {
  path: "M 20 180 L 20 20 L 100 120 L 180 20 L 180 180",
  checkpoints: linePoints([[20, 180], [20, 20], [100, 120], [180, 20], [180, 180]], 3),
  startPoint: { x: 20, y: 180 },
};

const letterN: TracePathData = {
  path: "M 40 180 L 40 20 L 160 180 L 160 20",
  checkpoints: linePoints([[40, 180], [40, 20], [160, 180], [160, 20]], 3),
  startPoint: { x: 40, y: 180 },
};

const letterO: TracePathData = {
  path: "M 100 20 Q 170 20 170 100 Q 170 180 100 180 Q 30 180 30 100 Q 30 20 100 20",
  checkpoints: circlePoints(100, 100, 75, 10),
  startPoint: { x: 100, y: 20 },
};

const letterP: TracePathData = {
  path: "M 40 180 L 40 20 L 120 20 Q 170 20 170 60 Q 170 100 120 100 L 40 100",
  checkpoints: [
    ...linePoints([[40, 180], [40, 20]], 3),
    { x: 120, y: 20 }, { x: 170, y: 60 }, { x: 120, y: 100 }, { x: 40, y: 100 },
  ],
  startPoint: { x: 40, y: 180 },
};

const letterQ: TracePathData = {
  path: "M 100 20 Q 170 20 170 100 Q 170 180 100 180 Q 30 180 30 100 Q 30 20 100 20 M 130 150 L 170 190",
  checkpoints: [
    ...circlePoints(100, 100, 75, 10),
    ...linePoints([[130, 150], [170, 190]], 2),
  ],
  startPoint: { x: 100, y: 20 },
};

const letterR: TracePathData = {
  path: "M 40 180 L 40 20 L 120 20 Q 170 20 170 60 Q 170 100 120 100 L 40 100 M 110 100 L 170 180",
  checkpoints: [
    ...linePoints([[40, 180], [40, 20]], 3),
    { x: 120, y: 20 }, { x: 170, y: 60 }, { x: 120, y: 100 }, { x: 40, y: 100 },
    ...linePoints([[110, 100], [170, 180]], 2),
  ],
  startPoint: { x: 40, y: 180 },
};

const letterS: TracePathData = {
  path: "M 155 50 Q 155 20 120 20 L 80 20 Q 45 20 45 55 Q 45 90 80 100 L 120 100 Q 155 110 155 145 Q 155 180 120 180 L 80 180 Q 45 180 45 150",
  checkpoints: [
    { x: 155, y: 50 }, { x: 130, y: 20 }, { x: 80, y: 20 },
    { x: 45, y: 45 }, { x: 65, y: 100 }, { x: 100, y: 100 },
    { x: 140, y: 110 }, { x: 155, y: 145 },
    { x: 120, y: 180 }, { x: 80, y: 180 }, { x: 45, y: 150 },
  ],
  startPoint: { x: 155, y: 50 },
};

const letterT: TracePathData = {
  path: "M 20 20 L 180 20 M 100 20 L 100 180",
  checkpoints: [
    ...linePoints([[20, 20], [180, 20]], 3),
    ...linePoints([[100, 20], [100, 180]], 4),
  ],
  startPoint: { x: 20, y: 20 },
};

const letterU: TracePathData = {
  path: "M 40 20 L 40 140 Q 40 180 100 180 Q 160 180 160 140 L 160 20",
  checkpoints: [
    ...linePoints([[40, 20], [40, 140]], 3),
    { x: 60, y: 180 }, { x: 100, y: 180 }, { x: 140, y: 180 },
    ...linePoints([[160, 140], [160, 20]], 3),
  ],
  startPoint: { x: 40, y: 20 },
};

const letterV: TracePathData = {
  path: "M 20 20 L 100 180 L 180 20",
  checkpoints: linePoints([[20, 20], [100, 180], [180, 20]], 4),
  startPoint: { x: 20, y: 20 },
};

const letterW: TracePathData = {
  path: "M 10 20 L 50 180 L 100 80 L 150 180 L 190 20",
  checkpoints: linePoints([[10, 20], [50, 180], [100, 80], [150, 180], [190, 20]], 3),
  startPoint: { x: 10, y: 20 },
};

const letterX: TracePathData = {
  path: "M 30 20 L 170 180 M 170 20 L 30 180",
  checkpoints: [
    ...linePoints([[30, 20], [170, 180]], 4),
    ...linePoints([[170, 20], [30, 180]], 4),
  ],
  startPoint: { x: 30, y: 20 },
};

const letterY: TracePathData = {
  path: "M 30 20 L 100 100 L 170 20 M 100 100 L 100 180",
  checkpoints: [
    ...linePoints([[30, 20], [100, 100]], 3),
    ...linePoints([[170, 20], [100, 100]], 3),
    ...linePoints([[100, 100], [100, 180]], 2),
  ],
  startPoint: { x: 30, y: 20 },
};

const letterZ: TracePathData = {
  path: "M 30 20 L 170 20 L 30 180 L 170 180",
  checkpoints: linePoints([[30, 20], [170, 20], [30, 180], [170, 180]], 3),
  startPoint: { x: 30, y: 20 },
};

// ---------------------------------------------------------------------------
// Numbers 0-9
// ---------------------------------------------------------------------------

const number0: TracePathData = {
  path: "M 100 20 Q 170 20 170 100 Q 170 180 100 180 Q 30 180 30 100 Q 30 20 100 20",
  checkpoints: circlePoints(100, 100, 75, 10),
  startPoint: { x: 100, y: 20 },
};

const number1: TracePathData = {
  path: "M 70 50 L 100 20 L 100 180 M 60 180 L 140 180",
  checkpoints: [
    ...linePoints([[70, 50], [100, 20], [100, 180]], 4),
    ...linePoints([[60, 180], [140, 180]], 2),
  ],
  startPoint: { x: 70, y: 50 },
};

const number2: TracePathData = {
  path: "M 40 60 Q 40 20 100 20 Q 160 20 160 60 Q 160 100 100 120 L 40 180 L 160 180",
  checkpoints: [
    { x: 40, y: 60 }, { x: 60, y: 20 }, { x: 100, y: 20 }, { x: 140, y: 20 },
    { x: 160, y: 60 }, { x: 140, y: 100 }, { x: 100, y: 120 },
    { x: 60, y: 160 }, { x: 40, y: 180 }, { x: 100, y: 180 }, { x: 160, y: 180 },
  ],
  startPoint: { x: 40, y: 60 },
};

const number3: TracePathData = {
  path: "M 40 40 Q 40 20 100 20 Q 160 20 160 55 Q 160 90 100 100 Q 160 110 160 145 Q 160 180 100 180 Q 40 180 40 160",
  checkpoints: [
    { x: 40, y: 40 }, { x: 70, y: 20 }, { x: 100, y: 20 },
    { x: 160, y: 40 }, { x: 160, y: 70 }, { x: 120, y: 100 }, { x: 100, y: 100 },
    { x: 160, y: 120 }, { x: 160, y: 150 },
    { x: 120, y: 180 }, { x: 70, y: 180 }, { x: 40, y: 160 },
  ],
  startPoint: { x: 40, y: 40 },
};

const number4: TracePathData = {
  path: "M 130 180 L 130 20 L 30 130 L 170 130",
  checkpoints: linePoints([[130, 180], [130, 20], [30, 130], [170, 130]], 4),
  startPoint: { x: 130, y: 180 },
};

const number5: TracePathData = {
  path: "M 150 20 L 50 20 L 50 90 Q 50 90 100 90 Q 160 90 160 135 Q 160 180 100 180 Q 50 180 50 160",
  checkpoints: [
    ...linePoints([[150, 20], [50, 20], [50, 90]], 3),
    { x: 100, y: 90 }, { x: 160, y: 110 }, { x: 160, y: 135 },
    { x: 140, y: 180 }, { x: 100, y: 180 }, { x: 50, y: 160 },
  ],
  startPoint: { x: 150, y: 20 },
};

const number6: TracePathData = {
  path: "M 150 40 Q 150 20 110 20 Q 50 20 50 80 L 50 140 Q 50 180 100 180 Q 150 180 150 140 Q 150 100 100 100 Q 50 100 50 130",
  checkpoints: [
    { x: 150, y: 40 }, { x: 120, y: 20 }, { x: 80, y: 20 },
    { x: 50, y: 50 }, { x: 50, y: 100 }, { x: 50, y: 140 },
    { x: 80, y: 180 }, { x: 120, y: 180 },
    { x: 150, y: 150 }, { x: 150, y: 110 }, { x: 120, y: 100 }, { x: 80, y: 100 },
  ],
  startPoint: { x: 150, y: 40 },
};

const number7: TracePathData = {
  path: "M 30 20 L 170 20 L 80 180",
  checkpoints: linePoints([[30, 20], [170, 20], [80, 180]], 4),
  startPoint: { x: 30, y: 20 },
};

const number8: TracePathData = {
  path: "M 100 100 Q 45 90 45 55 Q 45 20 100 20 Q 155 20 155 55 Q 155 90 100 100 Q 40 110 40 145 Q 40 180 100 180 Q 160 180 160 145 Q 160 110 100 100",
  checkpoints: [
    { x: 100, y: 100 }, { x: 55, y: 80 }, { x: 45, y: 55 },
    { x: 65, y: 20 }, { x: 100, y: 20 }, { x: 135, y: 20 },
    { x: 155, y: 55 }, { x: 140, y: 90 }, { x: 100, y: 100 },
    { x: 55, y: 120 }, { x: 40, y: 145 },
    { x: 65, y: 180 }, { x: 100, y: 180 }, { x: 135, y: 180 },
    { x: 160, y: 145 }, { x: 145, y: 115 },
  ],
  startPoint: { x: 100, y: 100 },
};

const number9: TracePathData = {
  path: "M 150 100 Q 150 100 100 100 Q 50 100 50 60 Q 50 20 100 20 Q 150 20 150 60 L 150 140 Q 150 180 100 180 Q 60 180 50 160",
  checkpoints: [
    { x: 150, y: 100 }, { x: 120, y: 100 }, { x: 80, y: 100 },
    { x: 50, y: 80 }, { x: 50, y: 50 },
    { x: 80, y: 20 }, { x: 120, y: 20 },
    { x: 150, y: 50 }, { x: 150, y: 100 },
    { x: 150, y: 140 }, { x: 130, y: 180 }, { x: 80, y: 180 }, { x: 50, y: 160 },
  ],
  startPoint: { x: 150, y: 100 },
};

// ---------------------------------------------------------------------------
// Path registry
// ---------------------------------------------------------------------------

const TRACE_PATHS: Record<string, TracePathData> = {
  // Shapes
  circle,
  square,
  triangle,

  // Letters
  A: letterA,
  B: letterB,
  C: letterC,
  D: letterD,
  E: letterE,
  F: letterF,
  G: letterG,
  H: letterH,
  I: letterI,
  J: letterJ,
  K: letterK,
  L: letterL,
  M: letterM,
  N: letterN,
  O: letterO,
  P: letterP,
  Q: letterQ,
  R: letterR,
  S: letterS,
  T: letterT,
  U: letterU,
  V: letterV,
  W: letterW,
  X: letterX,
  Y: letterY,
  Z: letterZ,

  // Numbers
  "0": number0,
  "1": number1,
  "2": number2,
  "3": number3,
  "4": number4,
  "5": number5,
  "6": number6,
  "7": number7,
  "8": number8,
  "9": number9,
};

/**
 * Look up SVG path data for a given shape key.
 * Returns undefined if the shape is not recognized.
 */
export function getTracePath(shape: string): TracePathData | undefined {
  // Normalize: accept lowercase letters too
  const key = shape.length === 1 && /[a-z]/.test(shape) ? shape.toUpperCase() : shape;
  return TRACE_PATHS[key];
}

/**
 * Returns all available shape keys for validation / UI display.
 */
export function getAvailableShapes(): string[] {
  return Object.keys(TRACE_PATHS);
}
