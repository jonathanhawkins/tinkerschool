# Research: Alternative Math Teaching Methods for Ages 5-8 (K-2)

> Reference document for building interactive math lessons in TinkerSchool.
> Covers visual strategies, alternative algorithms, gamification approaches,
> widget mapping for existing types, and proposals for new widget types.

---

## Table of Contents

1. [Visual Methods for Addition & Subtraction](#1-visual-methods-for-addition--subtraction)
2. [Alternative Algorithms](#2-alternative-algorithms)
3. [Gamification Approaches](#3-gamification-approaches)
4. [Widget Mapping Summary](#4-widget-mapping-summary)
5. [New Widget Types to Build](#5-new-widget-types-to-build)
6. [Implementation Priority](#6-implementation-priority)
7. [Sources](#7-sources)

---

## 1. Visual Methods for Addition & Subtraction

### 1.1 Number Line Jumping / Hopping

**How it works:** A horizontal line marked with numbers (typically 0-20 for K-2). Students place a marker on the first number, then "jump" forward for addition or backward for subtraction. For `7 + 5`, place a marker on 7, then make 5 forward hops to land on 12. Jumps can be single hops (count by 1s) or grouped hops (jump by 5s or 10s for larger numbers).

**Why it is more intuitive:** It turns an abstract equation into physical movement along a path. Kids can see that addition means "going forward" and subtraction means "going backward." The spatial relationship between numbers becomes visible. Teachers often use a frog character that "hops" along the line, making it playful and memorable.

**Best for:** Grades K-2 (ages 5-8). Kindergarteners use it for counting and +/- within 10. First and second graders extend to +/- within 20 and eventually within 100 using "open number lines" where they choose their own jump sizes.

**App implementation:**
- Drag a character (frog, Chip mascot) along a number line
- Tap to create hops of chosen sizes
- Number line auto-zooms for larger ranges
- Show arc lines above the number line to visualize each hop
- Animated hop with sound effect for each step

**Existing widgets that partially work:**
- `sequence_order` -- could order numbers on a line, but lacks spatial drag
- `counting` -- taps to count, but no number line visualization

**New widget needed:** `number_line` (see Section 5)

---

### 1.2 Bar Models / Tape Diagrams (Singapore Math)

**How it works:** Quantities are drawn as rectangular bars. For addition, two bars are placed end-to-end and a longer bar below shows the total. For subtraction, a long bar is drawn for the whole, then partitioned into a known part and an unknown part marked with `?`. The visual makes it clear what operation is needed. Example: "Sam has 8 apples. He gets 5 more. How many total?" Draw a bar of length 8, attach a bar of length 5, then show a bracket below labeled `?` spanning the whole thing.

**Why it is more intuitive:** Word problems are the #1 struggle area for young kids. Bar models convert confusing word problems into a simple picture. The bar lengths are proportional to the numbers, so kids develop number sense about relative sizes. Singapore has used this method since the 1980s and consistently ranks #1 in international math assessments (TIMSS). The method works because it bridges the concrete (physical bars) to the abstract (equations) through the pictorial (drawn bars).

**Best for:** Grades 1-2 (ages 6-8) for simple addition/subtraction. Extends through grade 6 for multiplication, fractions, ratios, and algebra.

**App implementation:**
- Drag-to-resize bars to represent quantities
- Snap bars together for addition, partition bars for subtraction
- Label bars with numbers or `?` for unknowns
- Word problem presented as a story, student builds the bar model
- Chip asks guiding questions: "Which number is the whole?" / "Which parts do we know?"

**Existing widgets that partially work:**
- `fill_in_blank` -- could ask "what goes in the missing part" after showing a bar model image
- `multiple_choice` -- could ask which bar model matches a word problem

**New widget needed:** `bar_model` (see Section 5)

---

### 1.3 Rekenrek (Counting Rack)

**How it works:** A frame with two rows of 10 beads each. Each row has 5 red beads and 5 white beads. The color break at 5 helps kids subitize (instantly recognize quantities without counting one by one). To show 7, slide 5 red beads and 2 white beads on the top row. The remaining 3 visible white beads instantly show "3 more to make 10." For addition like `8 + 5`: show 8 on top row (5 red + 3 white), then 5 on bottom row (5 red). Kids can see that moving 2 from the bottom row to "complete" the top row to 10 leaves 3, so the answer is 13.

**Why it is more intuitive:** The 5-and-10 structure matches how our number system works. Kids stop counting by ones and start thinking in groups of 5 and 10, which is the foundation of all mental math. The color break is the key insight -- it lets kids "see" quantities instantly. Unlike loose counters that get dropped or lost, the beads stay on the rod. It was designed by Adrian Treffers at the Freudenthal Institute in the Netherlands specifically to build number sense.

**Best for:** Grades K-1 (ages 5-7). The sweet spot for building subitizing skills and "making 10" foundations.

**App implementation:**
- Two rows of 10 beads (5 red, 5 white each)
- Slide beads left/right by dragging or tapping
- Display running count as beads are moved
- Prompt: "Show me the number 8" or "Add 7 + 5"
- Animate bead movement with a satisfying click sound
- Highlight the "making 10" strategy when relevant

**Existing widgets that partially work:**
- `counting` -- tap to count, but lacks the bead/rack visualization

**New widget needed:** `rekenrek` (see Section 5)

---

### 1.4 "Making 10" Strategy

**How it works:** When adding two numbers, decompose one of them so that part of it "fills up" the other number to 10, then add the leftover. Example: `8 + 5` becomes `8 + 2 + 3` = `10 + 3` = `13`. The student sees that 8 needs 2 more to make 10, so they "break apart" the 5 into 2 and 3. This strategy relies on knowing all the number pairs that sum to 10 (called "friends of 10" or "number bonds to 10"): 1+9, 2+8, 3+7, 4+6, 5+5.

**Why it is more intuitive:** Our entire number system is base-10. Once kids fluently know the pairs that make 10, they can add any single-digit numbers mentally by "bridging through 10." This is the single most important mental math strategy for grades 1-2 and the foundation for all later arithmetic. It replaces rote memorization of 100 addition facts with a flexible strategy that builds understanding.

**Best for:** Grades 1-2 (ages 6-8). Prerequisite: knowing friends-of-10 pairs (introduced in K).

**App implementation:**
- Show two groups of objects (e.g., 8 stars and 5 stars)
- Student drags objects from the second group to "fill up" the first group to 10
- Remaining objects are counted as the ones digit
- Ten frame visualization shows the "making 10" clearly
- Animated transition: 8+5 -> (8+2)+3 -> 10+3 -> 13

**Existing widgets that partially work:**
- `fill_in_blank` -- "8 + ___ = 10, so 8 + 5 = 10 + ___ = ___"
- `matching_pairs` -- match numbers to their "friend of 10" partner
- `multiple_choice` -- "Which number do you need to make 10?"

**New widget needed:** `ten_frame` (see Section 5) -- works hand-in-hand with the rekenrek but uses a grid layout

---

### 1.5 "Friendly Numbers" / Compensation Strategy

**How it works:** Round one number to a "friendly" number (usually a multiple of 10), do the easy math, then adjust. For addition: `34 + 49` becomes `34 + 50 = 84`, then subtract the 1 you added: `84 - 1 = 83`. For subtraction: `64 - 28` becomes `64 - 30 = 34`, then add back the 2: `34 + 2 = 36`. The key insight is that it is much easier to add/subtract multiples of 10.

**Why it is more intuitive:** This mirrors how adults actually do mental math. Nobody uses the traditional carrying algorithm in their head at the grocery store. Instead, they round to convenient numbers and adjust. Teaching this explicitly gives kids a powerful mental tool. It also deepens number sense by asking "how far is this number from the nearest 10?"

**Best for:** Grades 2-3 (ages 7-9). Requires comfort with +/- within 20 and understanding of place value.

**App implementation:**
- Show the original problem
- Student chooses which number to round (tap to select)
- Animated number line shows the rounding
- Student solves the easier problem
- Student adjusts (adds or subtracts the compensation amount)
- Step-by-step scaffolding with Chip guiding each step

**Existing widgets that partially work:**
- `fill_in_blank` -- step-by-step: "49 rounded to ___", "34 + 50 = ___", "84 - 1 = ___"
- `sequence_order` -- order the steps of the compensation strategy
- `multiple_choice` -- "Which friendly number is closest to 49?"

**New widget needed:** Could work with `fill_in_blank` chains, but a `step_by_step_solver` widget would be ideal (see Section 5)

---

### 1.6 Cuisenaire Rods

**How it works:** A set of 10 colored rods of lengths 1 through 10. Each length has a fixed color: white=1, red=2, green=3, purple=4, yellow=5, dark green=6, black=7, brown=8, blue=9, orange=10. Students explore number relationships by placing rods side by side. Two red rods (2+2) are the same length as one purple rod (4). A yellow rod (5) plus a green rod (3) equals a brown rod (8). Students discover addition, subtraction, and even fractions through physical comparison of lengths.

**Why it is more intuitive:** Invented by Belgian teacher Georges Cuisenaire, who noticed his music students understood half notes and quarter notes easily but struggled with the same fractions in math. He created colored rods to make numbers as visible and tangible as musical notation. The rods work because they make number relationships spatial. Kids literally see that 3 + 4 = 7 because the rods are the same length when placed side by side. No counting required -- it is a direct visual proof.

**Best for:** Grades K-2 (ages 5-8). Especially powerful for building number sense, understanding addition/subtraction relationships, and early fraction concepts.

**App implementation:**
- Draggable colored rods of proportional lengths
- Snap-to-grid placement
- Workspace where kids arrange rods to solve problems
- "Train" mode: build a train of small rods that matches a longer rod
- Prompt: "Which two rods make the same length as the brown (8) rod?"
- Auto-check: highlight when two groups are the same length

**Existing widgets that partially work:**
- `matching_pairs` -- match rod combinations to their total
- `multiple_choice` -- "Which rod completes this train?"

**New widget needed:** `cuisenaire_rods` or more broadly `drag_and_snap` (see Section 5)

---

### 1.7 Base-10 Blocks / Place Value Chips

**How it works:** Physical or virtual manipulatives representing ones (small cubes), tens (rods of 10 cubes), and hundreds (flat squares of 100 cubes). To represent 47, students use 4 tens-rods and 7 ones-cubes. For addition like `35 + 27`: combine 3 tens + 2 tens = 5 tens, and 5 ones + 7 ones = 12 ones. Then "trade" 10 of those ones for 1 tens-rod, getting 6 tens + 2 ones = 62. This physical trading is the concrete version of "carrying" / regrouping.

**Why it is more intuitive:** The traditional algorithm tells kids to "carry the 1" but never explains what that 1 represents. With base-10 blocks, kids physically trade 10 ones-cubes for 1 tens-rod, making regrouping tangible and logical rather than a mysterious procedure. Virtual base-10 blocks from platforms like The Math Learning Center (Number Pieces) and Brainingcamp let kids drag, combine, and break apart blocks with a single click.

**Best for:** Grades 1-3 (ages 6-9). Essential for understanding place value and multi-digit addition/subtraction with regrouping.

**App implementation:**
- Draggable ones-cubes, tens-rods, and hundreds-flats
- Drop zones for ones, tens, hundreds columns
- "Trade" button: tap 10 ones to exchange for 1 ten (animated transformation)
- Reverse trade: tap a ten to break it into 10 ones (for subtraction borrowing)
- Problem prompt at top, student builds the answer with blocks
- Auto-count display shows the current total

**Existing widgets that partially work:**
- `counting` -- could count blocks, but no place value structure
- `fill_in_blank` -- "3 tens and 5 ones = ___"

**New widget needed:** `base_ten_blocks` (see Section 5)

---

### 1.8 Butterfly Method for Fractions

**How it works:** A visual shortcut for comparing or adding fractions with different denominators. Draw two fractions side by side (e.g., 2/3 and 3/4). Draw diagonal lines connecting numerator of one fraction to denominator of the other (forming a butterfly wing shape). Multiply along each diagonal: 2x4=8 and 3x3=9. For comparison: 8 < 9, so 2/3 < 3/4. For addition: the "wings" become the new numerators (8 and 9), and the common denominator is the product of the original denominators (3x4=12), so 2/3 + 3/4 = 8/12 + 9/12 = 17/12. The visual butterfly shape makes it memorable and pattern-based.

**Why it is more intuitive:** Finding common denominators is the #1 stumbling block with fractions. The butterfly method bypasses the need to find the LCD by using cross-multiplication in a visual pattern. It went viral on TikTok because it feels like a magic trick and teachers can explain it in 60 seconds. However, it is worth noting that many math educators caution against teaching it as a trick without understanding -- it should be paired with visual fraction models.

**Best for:** Grades 3-5 (ages 8-11). Beyond our K-2 target, but worth including for Band 3+ curriculum. For K-2, simpler fraction concepts (halves, fourths) should use visual models instead.

**App implementation:**
- Animated butterfly drawing over two fractions
- Step-by-step: draw wing 1, multiply, draw wing 2, multiply
- Color-coded wings to track which numbers go where
- Interactive: student fills in the products at each wing
- Final step: combine into answer

**Existing widgets that partially work:**
- `fill_in_blank` -- step-by-step multiplication and addition
- `multiple_choice` -- "Which fraction is larger?"

**New widget needed:** `fraction_visualizer` (see Section 5) -- for the visual model; butterfly animation could be a guided tutorial overlay

---

## 2. Alternative Algorithms

### 2.1 Number Bonds (Part-Part-Whole)

**How it works:** A circle-and-branch diagram showing that a "whole" number is made of two "parts." The whole is in a circle at the top, connected by lines to two part-circles below. Example: whole=7, parts=3 and 4. Given any two of the three numbers, kids can find the third. If whole=7 and part1=3, then part2=? This single diagram teaches addition (3+4=7), subtraction (7-3=4), and the relationship between them simultaneously.

**Why it is more intuitive:** Traditional teaching separates addition and subtraction into different units. Number bonds unify them as two views of the same relationship. Kids see that if they know 3+4=7, they automatically know 7-3=4 and 7-4=3. This is called the "fact family" and it cuts the number of facts kids need to memorize by half. The visual diagram makes the relationship concrete and easy to remember.

**Best for:** Grades K-2 (ages 5-8). The foundational representation for understanding addition and subtraction as related operations.

**App implementation:**
- Three circles connected by lines (whole on top, two parts below)
- One or two circles pre-filled, student fills the missing one(s)
- Drag numbers from a number bank into the circles
- Chip says "If the whole is 9 and one part is 4, what is the other part?"
- Progress through difficulty: first fill one missing, then two missing
- Animated "break apart" visualization showing the whole splitting into parts

**Existing widgets that partially work:**
- `fill_in_blank` -- "3 + ___ = 7" captures the logic but not the visual
- `matching_pairs` -- match whole numbers to their part-pairs
- `multiple_choice` -- "Which pair of numbers makes 9?"

**New widget needed:** `number_bond` (see Section 5)

---

### 2.2 Left-to-Right Addition

**How it works:** Instead of the traditional right-to-left algorithm (add ones first, carry, add tens, carry, etc.), students add from the largest place value first. For `47 + 35`: First add the tens: 40 + 30 = 70. Then add the ones: 7 + 5 = 12. Then combine: 70 + 12 = 82. This is sometimes called "expanded form addition" or the "break apart" method.

**Why it is more intuitive:** When we read numbers, we read left to right. When we estimate, we look at the biggest digits first. The traditional algorithm forces kids to start with the least important digits (ones) and work backwards, which is counterintuitive. Left-to-right addition aligns with how kids naturally think about numbers. It also builds place value understanding because kids must decompose numbers into tens and ones explicitly.

**Best for:** Grades 1-2 (ages 6-8). Excellent as a mental math strategy and stepping stone to the standard algorithm.

**App implementation:**
- Show the original problem: 47 + 35
- Student decomposes each number: 47 = 40 + 7, 35 = 30 + 5
- Add tens together: 40 + 30 = 70
- Add ones together: 7 + 5 = 12
- Combine: 70 + 12 = 82
- Each step visualized with expanding number tiles

**Existing widgets that partially work:**
- `fill_in_blank` -- multi-step: "47 = 40 + ___", "40 + 30 = ___", "7 + 5 = ___", "70 + 12 = ___"
- `sequence_order` -- order the steps of the decomposition

**New widget needed:** `decompose_and_solve` or `step_by_step_solver` (see Section 5)

---

### 2.3 Decomposition / "New Math" Subtraction

**How it works:** Break the subtraction into friendly steps. For `52 - 17`: first subtract to get to a tens boundary: `52 - 2 = 50`. Then subtract the remaining: `50 - 15 = 35`. Or alternatively: `52 - 10 = 42`, then `42 - 7 = 35`. The student chooses which decomposition feels easiest. The key principle is: large subtractions are hard, but subtracting 10s and subtracting to reach 10s are easy.

**Why it is more intuitive:** The traditional borrowing algorithm (cross out the 5, make it 4, make the 2 into 12...) is procedurally confusing and error-prone for young kids. Decomposition lets kids break hard problems into easy steps they can do mentally. It also builds flexibility -- there is no single "right way," and kids develop strategic thinking by choosing their decomposition path.

**Best for:** Grades 1-3 (ages 6-9). Requires comfort with subtracting multiples of 10 and subtracting single digits.

**App implementation:**
- Show the original problem: 52 - 17
- Student chooses how to break it: "I'll subtract 10 first" or "I'll subtract to 50 first"
- Each step shown on a number line with jumps
- Multiple paths accepted as correct
- Chip celebrates any valid decomposition

**Existing widgets that partially work:**
- `fill_in_blank` -- "52 - 10 = ___", "42 - 7 = ___"
- `sequence_order` -- order the decomposition steps
- `multiple_choice` -- "What's a good first step?"

**New widget needed:** Benefits from `number_line` + `step_by_step_solver`

---

### 2.4 Lattice Multiplication

**How it works:** Draw a grid where each cell is split diagonally. Write one factor's digits across the top and the other factor's digits down the right side. Multiply each pair of digits and write the product in the corresponding cell (tens digit above the diagonal, ones digit below). Then add along each diagonal stripe from right to left, carrying as needed. The final answer reads from top-left to bottom-right of the diagonal sums.

**Why it is more intuitive:** The standard multiplication algorithm requires kids to keep track of place value, partial products, and alignment all at once. The lattice method compartmentalizes each step: multiply one digit pair at a time, put it in a box, then add diagonals. Place value is handled automatically by the grid structure. Kids who struggle with alignment errors in standard multiplication often succeed with lattice because each product has a designated home.

**Best for:** Grades 3-5 (ages 8-11). Beyond K-2, but important for Band 3+ TinkerSchool curriculum.

**App implementation:**
- Auto-generate the lattice grid based on factor lengths
- Student fills in each cell by multiplying digit pairs
- Diagonal addition step shown with animated sweep
- Color-coded diagonals help track the addition
- Final answer assembled at the bottom

**Existing widgets that partially work:**
- `fill_in_blank` -- could fill individual cells, but lacks grid structure

**New widget needed:** `lattice_grid` or `grid_math` (see Section 5)

---

### 2.5 Box / Area Model Multiplication

**How it works:** Draw a rectangle. Split it into sections based on place value. For `23 x 14`: split the rectangle into 4 boxes: (20 x 10), (20 x 4), (3 x 10), (3 x 4). Calculate each partial product: 200, 80, 30, 12. Sum them: 200 + 80 + 30 + 12 = 322. The rectangle's area represents the total product, and each sub-rectangle represents a partial product.

**Why it is more intuitive:** It makes the distributive property visible. Kids can see that multiplication of two-digit numbers is really just four simpler multiplications added together. The spatial representation connects multiplication to area, which is a concept kids understand from tiling and measuring. It is also the basis for algebra later (FOIL method is just the area model with variables).

**Best for:** Grades 3-5 (ages 8-11). Like lattice, beyond K-2 but valuable for older bands.

**App implementation:**
- Resizable rectangle that splits based on place value
- Student labels each dimension and fills in partial products
- Auto-sum with animated combination of partial products
- Connections to area measurement concepts

**Existing widgets that partially work:**
- `fill_in_blank` -- calculate partial products and sum

**New widget needed:** `area_model` (see Section 5)

---

## 3. Gamification Approaches

### 3.1 Math Through Physical Manipulation (Tangrams & Pattern Blocks)

**How it works:** Tangrams are 7 geometric pieces (5 triangles, 1 square, 1 parallelogram) that can be arranged to form shapes. Pattern blocks are 6 standard shapes (hexagons, trapezoids, rhombuses, triangles, squares) that tile together. Both teach geometry, spatial reasoning, symmetry, fractions (what fraction of the hexagon is the trapezoid?), and area concepts through hands-on play.

**Why it is more intuitive:** Kids learn geometry best through manipulation, not memorization of definitions. Tangrams develop spatial visualization (rotating and flipping shapes mentally), which research shows is a strong predictor of math achievement. The puzzle aspect creates intrinsic motivation -- kids want to solve the challenge, and math learning happens as a side effect.

**Best for:** Grades K-2 (ages 5-8) for spatial reasoning and shape recognition. Grades 2-4 for fractions and area.

**App implementation:**
- Draggable, rotatable, flippable shape pieces
- Shadow silhouette to fill (tangram puzzles)
- Free-play mode: build any shape
- Guided challenges: "Use 3 pieces to fill the shape"
- Fractions mode: "How many triangles fill the hexagon?"

**Existing widgets that partially work:**
- `matching_pairs` -- match shapes to names
- `multiple_choice` -- "How many triangles make a square?"

**New widget needed:** `shape_builder` / `tangram_puzzle` (see Section 5)

---

### 3.2 Story Problems with Characters (Contextual Math)

**How it works:** Instead of bare equations ("7 + 5 = ?"), problems are embedded in stories featuring relatable characters. "Chip the robot found 7 gears in the workshop. His friend Sparky gave him 5 more gears. How many gears does Chip have now?" The narrative context gives the numbers meaning, helping kids understand when to add vs. subtract. Characters can be recurring across lessons, building engagement.

**Why it is more intuitive:** Abstract numbers are meaningless to young kids. Stories activate comprehension, visualization, and emotional engagement. Research shows kids solve word problems more successfully when they care about the characters and context. Stories also help kids develop mathematical modeling skills -- translating real situations into math.

**Best for:** All grades K-2 (ages 5-8). Every math lesson should incorporate story context.

**App implementation:**
- Chip character appears with speech bubbles
- Animated scene illustrates the problem (gears appearing, characters moving)
- Student solves using any available widget (number line, bar model, etc.)
- Story continues based on the answer
- Wrong answers get encouraging "Try again!" with a hint from the story context

**Existing widgets that work well:**
- `multiple_choice` -- with story prompt
- `fill_in_blank` -- with story template
- `counting` -- count objects in the story scene

**Enhancement:** All existing widgets benefit from wrapping in a story context. This is a content/prompt pattern, not a new widget type. We should define a `story_wrapper` display component that wraps any widget with character art and narrative text.

---

### 3.3 Math Through Music and Rhythm (Skip Counting Songs)

**How it works:** Skip counting (counting by 2s, 5s, 10s) is taught through catchy songs with rhythmic beats. "2, 4, 6, 8 -- who do we appreciate!" Songs set to familiar tunes make the number sequences stick in long-term memory. Beyond skip counting, rhythm itself is mathematical -- time signatures, beats per measure, note durations are all fractional relationships.

**Why it is more intuitive:** Music activates different brain regions than verbal/analytical thinking. Singing number sequences creates stronger memory traces than reciting them. Research confirms that if something is sung, recall improves dramatically. Skip counting is the foundation of multiplication (5, 10, 15, 20... is the 5 times table), so musical fluency with these sequences directly accelerates multiplication readiness.

**Best for:** Grades K-2 (ages 5-8) for skip counting. The M5StickC Plus 2 buzzer makes this especially engaging since the device can play the tones while displaying the numbers.

**App implementation:**
- Buzzer plays a melody while numbers appear on screen in time with the beat
- Student taps along or fills in the missing number in the sequence
- "Karaoke mode": lyrics/numbers scroll and student says/taps the next one
- Rhythm challenge: tap the screen on every skip count beat
- Integrates with M5StickC buzzer for hardware-synced sound

**Existing widgets that partially work:**
- `sequence_order` -- order skip counting numbers
- `fill_in_blank` -- "2, 4, ___, 8, 10"
- `counting` -- tap along with the beat

**New widget needed:** `rhythm_tap` (see Section 5) -- combines audio playback with timed tapping

---

## 4. Widget Mapping Summary

### Existing Widgets and Their Math Applications

| Widget | Math Applications | Limitations for Math |
|--------|------------------|---------------------|
| `multiple_choice` | Compare strategies, identify correct answers, choose next step in decomposition, fraction comparison | Cannot show spatial/visual manipulation |
| `counting` | Count objects, count by 1s, subitize with dot patterns | No structure (no number line, no ten frame, no place value) |
| `matching_pairs` | Match number bonds (3+4 = 7), match rod combinations, match fractions to visuals | Only connects pairs; cannot build or construct |
| `sequence_order` | Order steps in a strategy, arrange numbers on a number line, skip counting sequences | No spatial positioning; purely ordinal |
| `flash_card` | Math fact practice, "friends of 10" pairs, skip counting facts | No visual strategy support; rote recall only |
| `fill_in_blank` | Step-by-step decomposition, missing number in equation, completing bar model labels | Text-only; no visual/spatial scaffolding |

### Coverage Gaps

The existing widgets handle **recall** (flash cards), **selection** (multiple choice), **ordering** (sequence), and **text input** (fill in blank) well. What they lack is:

1. **Spatial manipulation** -- dragging objects to specific positions on a line, grid, or canvas
2. **Visual construction** -- building representations (bar models, rod trains, block groups)
3. **Multi-step guided solving** -- stepping through a strategy with visual feedback at each stage
4. **Audio-synchronized interaction** -- tapping in rhythm, matching sounds to numbers
5. **Proportional visualization** -- seeing that a bar representing 8 is twice as long as a bar representing 4

---

## 5. New Widget Types to Build

### Priority 1 (High Impact, Band 1-2 Core)

#### 5.1 `number_line`

**Description:** An interactive horizontal number line where students place markers, make jumps, and visualize addition/subtraction as movement.

**Schema (proposed):**
```typescript
interface NumberLineQuestion {
  id: string;
  prompt: string;              // "Show 7 + 5 on the number line"
  min: number;                 // Start of number line (usually 0)
  max: number;                 // End of number line (usually 20)
  startPosition: number;       // Where to place the initial marker (7)
  correctEndPosition: number;  // Where the marker should end up (12)
  jumpSize?: number;           // Optional: force specific jump size
  showJumpArcs?: boolean;      // Show arcs above the line for each hop
  operation: "add" | "subtract";
  hint?: string;
}

interface NumberLineContent {
  type: "number_line";
  questions: NumberLineQuestion[];
}
```

**Interaction model:** Student drags a frog/Chip character along the line, or taps to create hops. Arcs drawn above the line show each hop. Validation checks final position.

**Methods served:** Number line jumping, decomposition visualization, compensation strategy

**Estimated build effort:** Medium (requires drag interaction + SVG/Canvas rendering)

---

#### 5.2 `ten_frame`

**Description:** A 2x5 grid (or two stacked 2x5 grids for numbers > 10) where students place counters to represent numbers and perform operations.

**Schema (proposed):**
```typescript
interface TenFrameQuestion {
  id: string;
  prompt: string;              // "Show 8 + 5 using making 10"
  targetNumber?: number;       // For "show this number" tasks
  operation?: {
    a: number;                 // First addend (8)
    b: number;                 // Second addend (5)
    type: "add" | "subtract";
  };
  showMakingTen?: boolean;     // Highlight the "making 10" step
  frameCount: 1 | 2;          // One frame (0-10) or two (0-20)
  hint?: string;
}

interface TenFrameContent {
  type: "ten_frame";
  questions: TenFrameQuestion[];
}
```

**Interaction model:** Tap cells to place/remove counters. For "making 10": first fill frame 1, then show overflow in frame 2. Animated counter movement when "making 10." Color distinction between the two addends.

**Methods served:** Making 10 strategy, subitizing, counting to 20, addition within 20

**Estimated build effort:** Medium (grid layout + tap interaction + animation)

---

#### 5.3 `number_bond`

**Description:** A part-part-whole diagram with three connected circles. One or two values are given; the student fills in the missing value(s).

**Schema (proposed):**
```typescript
interface NumberBondQuestion {
  id: string;
  prompt: string;              // "Find the missing part"
  whole: number | null;        // null if student must fill
  part1: number | null;        // null if student must fill
  part2: number | null;        // null if student must fill
  hint?: string;
}

interface NumberBondContent {
  type: "number_bond";
  questions: NumberBondQuestion[];
}
```

**Interaction model:** Three circles arranged in an inverted triangle. Pre-filled values shown, empty circles have input fields or drag-target areas. Number bank at bottom for younger kids. Validation with animated "split" or "combine" visualization.

**Methods served:** Number bonds, fact families, part-part-whole thinking, inverse operations

**Estimated build effort:** Low-Medium (simple layout, mainly styling + input validation)

---

#### 5.4 `rekenrek`

**Description:** A virtual counting rack with two rows of 10 beads (5 red + 5 white each).

**Schema (proposed):**
```typescript
interface RekenrekQuestion {
  id: string;
  prompt: string;              // "Show 13 on the rekenrek"
  targetNumber: number;        // The number to represent
  mode: "show" | "add" | "subtract";
  operands?: {
    a: number;
    b: number;
  };
  hint?: string;
}

interface RekenrekContent {
  type: "rekenrek";
  questions: RekenrekQuestion[];
}
```

**Interaction model:** Drag beads left/right along their rods. Click a bead to slide it and all beads to its left. Running count display updates in real-time. For addition: show first number, then slide more beads for the second number.

**Methods served:** Subitizing, making 10, counting, addition within 20, number sense

**Estimated build effort:** Medium (bead physics/snap + sliding animation)

---

### Priority 2 (High Impact, Band 2-3)

#### 5.5 `bar_model`

**Description:** Interactive bar/tape diagram builder for solving word problems visually.

**Schema (proposed):**
```typescript
interface BarModelQuestion {
  id: string;
  prompt: string;              // Story-based word problem
  bars: BarDefinition[];       // Pre-drawn bars
  unknowns: string[];          // Which values are hidden
  correctAnswers: Record<string, number>;
  hint?: string;
}

interface BarDefinition {
  id: string;
  label: string;               // "Sam's apples"
  value: number | null;        // null for unknown
  color: string;               // hex color
  row: number;                 // vertical position
  isSplit?: boolean;           // whether bar is divided into parts
  parts?: { label: string; value: number | null }[];
}

interface BarModelContent {
  type: "bar_model";
  questions: BarModelQuestion[];
}
```

**Interaction model:** Pre-drawn bars with some values hidden (shown as `?`). Student types in the missing values. Advanced mode: student builds their own bars by dragging and resizing. Proportional bar lengths give visual feedback on whether the answer is reasonable.

**Methods served:** Bar models (Singapore Math), word problem solving, comparison problems

**Estimated build effort:** Medium-High (proportional drawing, resizable bars, multiple interaction modes)

---

#### 5.6 `base_ten_blocks`

**Description:** Virtual place value blocks (ones cubes, tens rods, hundreds flats) for building numbers and performing operations.

**Schema (proposed):**
```typescript
interface BaseTenQuestion {
  id: string;
  prompt: string;              // "Build the number 47" or "Add 35 + 27"
  mode: "build" | "add" | "subtract";
  targetNumber?: number;
  operation?: { a: number; b: number; type: "add" | "subtract" };
  maxPlaceValue: "tens" | "hundreds";  // limit complexity
  hint?: string;
}

interface BaseTenBlocksContent {
  type: "base_ten_blocks";
  questions: BaseTenQuestion[];
}
```

**Interaction model:** Drag ones-cubes, tens-rods, hundreds-flats from a tray into a workspace. Place value columns snap blocks into position. "Trade" interaction: select 10 ones and tap trade to convert to 1 ten (animated). Reverse for subtraction borrowing. Running total displayed.

**Methods served:** Place value understanding, regrouping/trading, multi-digit addition/subtraction

**Estimated build effort:** High (drag-and-drop with grouping, trading animation, place value columns)

---

#### 5.7 `step_by_step_solver`

**Description:** A guided multi-step problem solver that walks students through a strategy one step at a time, with visual scaffolding at each step.

**Schema (proposed):**
```typescript
interface SolverStep {
  id: string;
  instruction: string;         // "First, round 49 to the nearest 10"
  inputType: "number" | "choice" | "expression";
  correctAnswer: string;
  visual?: "number_line" | "bar" | "equation";  // optional visual aid
  hint?: string;
}

interface StepByStepQuestion {
  id: string;
  prompt: string;              // The original problem
  strategy: string;            // "compensation" | "decomposition" | "left_to_right"
  steps: SolverStep[];
}

interface StepByStepContent {
  type: "step_by_step_solver";
  questions: StepByStepQuestion[];
}
```

**Interaction model:** Shows one step at a time. Student solves each step before advancing. Animated transition between steps. Visual context (mini number line, equation) updates as student progresses. Summary screen shows the full solution path at the end.

**Methods served:** Compensation strategy, decomposition, left-to-right addition, any multi-step strategy

**Estimated build effort:** Medium (step sequencing + pluggable visual components)

---

### Priority 3 (Enrichment, Band 2+)

#### 5.8 `cuisenaire_rods`

**Description:** Draggable colored rods of proportional lengths for exploring number relationships.

**Interaction model:** Drag rods from a palette. Snap to a grid. Compare lengths by aligning rods. "Does this combination match that rod?"

**Methods served:** Number relationships, addition/subtraction families, early fractions

**Estimated build effort:** Medium

---

#### 5.9 `shape_builder` / `tangram_puzzle`

**Description:** Draggable, rotatable, flippable geometric shapes for spatial reasoning puzzles.

**Interaction model:** Drag shapes from a tray. Rotate with gestures or buttons. Fill a target silhouette. Snap when close to correct position.

**Methods served:** Spatial reasoning, geometry, fractions of shapes, symmetry

**Estimated build effort:** High (rotation, flip, collision detection, silhouette matching)

---

#### 5.10 `rhythm_tap`

**Description:** Audio-synchronized tapping game for skip counting and pattern recognition.

**Interaction model:** Music plays. Numbers appear in sequence. Student taps the screen on each beat to advance to the next number. Missing numbers in the sequence require the student to tap at the right time without a visual prompt.

**Methods served:** Skip counting, multiplication readiness, pattern recognition

**Estimated build effort:** Medium (audio sync, timing detection)

---

#### 5.11 `drag_to_group`

**Description:** Sort objects by dragging them into labeled groups/categories.

**Interaction model:** Objects scattered on screen. Drop zones labeled with categories. Student drags each object to the correct group.

**Methods served:** Even/odd sorting, place value sorting, shape classification, comparing quantities

**Estimated build effort:** Low-Medium

---

#### 5.12 `fraction_visualizer`

**Description:** Interactive fraction representation using circles (pizza), rectangles (chocolate bar), or bar models.

**Interaction model:** Tap to split a shape into equal parts. Tap parts to shade them. Compare fractions side by side. Label each fraction.

**Methods served:** Fraction concepts, equivalent fractions, fraction comparison, butterfly method visualization

**Estimated build effort:** Medium-High

---

#### 5.13 `grid_math` (for Lattice / Area Model)

**Description:** A customizable grid for multiplication methods.

**Interaction model:** Auto-generated grid based on digit count. Student fills cells with products. Diagonal summing for lattice, row/column summing for area model.

**Methods served:** Lattice multiplication, area/box model multiplication

**Estimated build effort:** Medium

---

## 6. Implementation Priority

### Phase 1 -- Core K-1 Math Widgets (Immediate, Band 1)

| Widget | Impact | Effort | Methods Enabled |
|--------|--------|--------|-----------------|
| `number_bond` | Very High | Low-Med | Number bonds, fact families, part-part-whole |
| `ten_frame` | Very High | Medium | Making 10, subitizing, counting, addition |
| `number_line` | Very High | Medium | Jumping, decomposition, compensation |
| `drag_to_group` | High | Low-Med | Sorting, classifying, even/odd |

**Rationale:** These four widgets cover the three most critical K-1 math strategies (number bonds, making 10, number line) and add a general-purpose sorting widget. Combined with our existing `fill_in_blank`, `counting`, and `multiple_choice`, they enable a comprehensive K-1 math curriculum.

### Phase 2 -- Expanded K-2 Widgets (Band 1-2)

| Widget | Impact | Effort | Methods Enabled |
|--------|--------|--------|-----------------|
| `rekenrek` | High | Medium | Subitizing, making 10, mental math |
| `bar_model` | High | Med-High | Word problems, comparison, Singapore math |
| `step_by_step_solver` | High | Medium | All multi-step strategies |
| `base_ten_blocks` | High | High | Place value, regrouping, multi-digit ops |

### Phase 3 -- Advanced & Enrichment (Band 2-3+)

| Widget | Impact | Effort | Methods Enabled |
|--------|--------|--------|-----------------|
| `cuisenaire_rods` | Medium | Medium | Number relationships, early fractions |
| `fraction_visualizer` | Medium | Med-High | Fractions, equivalence, comparison |
| `rhythm_tap` | Medium | Medium | Skip counting, multiplication readiness |
| `shape_builder` | Medium | High | Geometry, spatial reasoning |
| `grid_math` | Medium | Medium | Lattice/area model multiplication |

### Content-Level Enhancements (No New Widgets Needed)

These can be implemented using existing and Phase 1 widgets:

1. **Story wrapper pattern** -- Wrap any widget with Chip character art and narrative context. Build as a reusable display component, not a widget type.

2. **Friends of 10 drill** -- Use `matching_pairs` to match number pairs that sum to 10 (1-9, 2-8, 3-7, 4-6, 5-5). Use `flash_card` for rapid recall.

3. **Skip counting sequences** -- Use `fill_in_blank` with pattern: "2, 4, ___, 8, ___, 12". Use `sequence_order` to arrange skip counting numbers.

4. **Comparing numbers** -- Use `multiple_choice` with visual supports: "Which is bigger: 47 or 39?"

5. **Decomposing numbers** -- Use `fill_in_blank` chains: "15 = 10 + ___", "23 = 20 + ___"

---

## 7. Sources

### Number Line Strategies
- [GRADE 1 SUPPLEMENT: Addition & Subtraction on the Number Line](https://www.mathlearningcenter.org/sites/default/files/pdfs/SecB1SUP-A3_AddSubNumLn-201304.pdf)
- [Open Number Line Addition - Math Coach's Corner](https://www.mathcoachscorner.com/2012/06/open-number-line-addition/)
- [How to Teach Number Line in Addition - Teaching with Kaylee B](https://www.teachingwithkayleeb.com/how-to-teach-number-line-in-addition-in-a-way-that-absolutely-works/)
- [Number Line Hop - Counting With Kids](https://www.countingwithkids.com/play/number-line-hop)

### Singapore Math / Bar Models
- [The Ultimate Elementary School Guide To The Bar Model - Third Space Learning](https://thirdspacelearning.com/us/blog/teach-bar-model-method/)
- [Singapore Math Bar Model: Solving Word Problems](https://esingaporemath.com/blog/bar-modeling)
- [Bar Modelling - Maths No Problem](https://mathsnoproblem.com/en/approach/bar-modelling)
- [Singapore Math: A Visual Approach to Word Problems (PDF)](https://www.greenwichschools.org/uploaded/district/curriculum/alp/ModelDrawing.pdf)

### Rekenrek / Counting Rack
- [All About Rekenreks: Number Racks in Kindergarten](https://www.makingnumbersensemakesense.com/post/all-about-rekenreks)
- [Learning to Think Mathematically with the Rekenrek (PDF)](https://www.mathlearningcenter.org/sites/default/files/pdfs/LTM_Rekenrek.pdf)
- [What Is A Rekenrek? - Third Space Learning](https://thirdspacelearning.com/us/blog/rekenrek/)
- [Building Number Sense with a Rekenrek](https://brownbagteacher.com/rekenrek/)

### Making 10 Strategy
- [Making 10 Strategy: Build Math Fact Fluency](https://rosiesgotclass.com/3-engaging-and-fun-ways-to-practice-making-10-strategy/)
- [Make a Ten Strategy for Addition - Math Coach's Corner](https://www.mathcoachscorner.com/2020/11/make-a-ten-strategy-for-addition/)
- [Making a Ten is an Important Mental Math Strategy](https://www.twoboysandadad.com/2017/10/making-ten-important-mental/)
- [14 Strategies for Teaching Addition in K-3](https://luckylittlelearners.com/14-strategies-for-teaching-addition/)

### Compensation / Friendly Numbers
- [Using Compensation for Quick Mental Math](https://www.forourschool.org/math-guides/compensation)
- [Compensation: An Addition Strategy - Shelley Gray](https://shelleygrayteaching.com/compensation/)
- [7 Important Mental Math Strategies](https://www.integrowmath.org/blog/7-important-mental-math-strategies-your-students-need-for-computation)
- [Essential Mental Math Strategies for First and Second Graders](https://susanjonesteaching.com/essential-mental-math-strategies-for-first-and-second-graders/)

### Cuisenaire Rods
- [Cuisenaire Rod Manipulatives - hand2mind](https://www.hand2mind.com/glossary-of-hands-on-manipulatives/cuisenaire-rods)
- [Cuisenaire Rods - Wikipedia](https://en.wikipedia.org/wiki/Cuisenaire_rods)
- [Cuisenaire Rod Lessons - Math For Love](https://mathforlove.com/lesson/cuisenaire-rod-lessons/)
- [21 Ways to Use Cuisenaire Rods](https://www.carriecutler.com/post/21-ways-to-use-cuisenaire-rods)

### Base-10 Blocks
- [Interactive Base-10 Blocks - Teach Starter](https://www.teachstarter.com/us/widget/interactive-base-10-blocks/)
- [Number Pieces - The Math Learning Center](https://www.mathlearningcenter.org/apps/number-pieces)
- [Base Ten Blocks - Brainingcamp](https://www.brainingcamp.com/base-ten-blocks)
- [Base Ten Blocks - Coolmath4Kids](https://www.coolmath4kids.com/manipulatives/base-ten-blocks)

### Butterfly Method (Fractions)
- [Butterfly Method: Adding Fractions - TikTok @mathtutorialsbyprofd](https://www.tiktok.com/@mathtutorialsbyprofd/video/7251933899259956486)
- [Draw a butterfly when adding fractions! - TikTok @pinkpencilmath](https://www.tiktok.com/@pinkpencilmath/video/6932252029851127042)

### Lattice / Area Model Multiplication
- [Lattice Multiplication - Khan Academy](https://www.khanacademy.org/math/arithmetic-home/multiply-divide/place-value-area-models/v/lattice-multiplication)
- [What Is Box Method Multiplication? - Third Space Learning](https://thirdspacelearning.com/us/blog/box-method-multiplication/)
- [Area Model for Multiplication - Mathematics LibreTexts](https://math.libretexts.org/Courses/College_of_the_Desert/College_of_the_Desert_MATH_011:_Math_Concepts_for_Elementary_School_Teachers__Number_Systems/06:_Multiplication/6.02:_Area_Model_for_Multiplication)

### Left-to-Right Addition / Alternative Algorithms
- [Left to Right Addition: A Powerful Mental Math Strategy - Shelley Gray](https://shelleygrayteaching.com/left-right-addition/)
- [Addition Strategies Progression - Maine DOE](https://www.maine.gov/doe/pl/math/addition)

### Number Bonds
- [Number Bonds and Part/Whole Thinking - Math Coach's Corner](https://www.mathcoachscorner.com/2014/12/number-bonds-and-partwhole-thinking/)
- [Number Bonds to 10, 20 and beyond - Math Mammoth](https://www.mathmammoth.com/practice/number-bonds)

### Math Through Music
- [Support Math Readiness Through Music - NAEYC](https://www.naeyc.org/our-work/families/support-math-readiness-through-music)
- [Skip Counting Songs - Musical Memory](https://musicalmemory.com/best-skip-counting-songs/)
- [15 Math Songs for Kids - Brighterly](https://brighterly.com/blog/math-songs-for-kids/)

### Tangrams & Pattern Blocks
- [Tangram Puzzles - Math Playground](https://www.mathplayground.com/tangram_puzzles.html)
- [Tangrams: Geometry Hands-On Math Manipulatives - hand2mind](https://www.hand2mind.com/glossary-of-hands-on-manipulatives/tangrams)

### Interactive Math Platforms (Reference Implementations)
- [Math Apps - The Math Learning Center](https://www.mathlearningcenter.org/apps)
- [Mathigon - The Mathematical Playground](https://mathigon.org/)
- [Virtual Manipulatives - Brainingcamp](https://www.brainingcamp.com/manipulatives/)
- [Virtual Manipulatives - Didax](https://www.didax.com/math/virtual-manipulatives.html)
- [Best Math Apps for Kids 2025 - Funexpected](https://funexpectedapps.com/en/blog-posts/best-math-apps-for-kids-2025-edition)
