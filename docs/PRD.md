# Product Requirements Document (PRD)
# TinkerSchool: Open-Source Learning, Powered by AI + Hardware
### The Classroom in Your Hand -- tinkerschool.ai

---

## 1. Vision & Mission

**TinkerSchool** is an open-source, AI-powered education platform that pairs every child with a personalized AI tutor ("Chip") and a pocket-sized computer (M5StickC Plus 2) to learn *any subject* -- math, reading, science, music, art, coding, and more -- through hands-on, interactive projects.

We believe every child on Earth deserves a world-class, personalized education. Not just kids whose parents can afford tutors or live near great schools. TinkerSchool gives each child their own AI tutor that learns *them* -- their pace, their interests, their struggles, their strengths -- and builds a custom learning path that meets them exactly where they are.

The M5StickC Plus 2 is "the classroom in your hand" -- a real computer with a screen, buttons, sensors, buzzer, and WiFi that transforms abstract concepts into tangible, interactive experiences. Counting? The device beeps along. Sound waves? The buzzer demonstrates. Gravity? The accelerometer measures it. Music? The speaker plays it. Art? The screen displays it.

**Core Philosophy:**
- **Learn by doing** -- every lesson ends with something real: a sound, a display, a measurement, a creation
- **First principles thinking** -- build understanding from the ground up, not memorization
- **Personalized, not standardized** -- Chip adapts to each child's learning style, interests, and pace
- **Fun first, curriculum second** -- if the kid isn't smiling, we're doing it wrong
- **Open source, open knowledge** -- all curriculum, code, and tools are free and community-driven
- **Hardware makes it real** -- abstract concepts become concrete when you can hold them in your hand

**Primary Users:** Cassidy (age 7, 1st grade) and children ages 5-12 (grades K-6)

**Domain:** [tinkerschool.ai](https://tinkerschool.ai)

---

## 2. Problem Statement

### What's Broken in Education

1. **One-size-fits-all curriculum** -- every child is different, but they all get the same worksheet. A kid who loves dinosaurs gets the same math problems as a kid who loves rockets. Engagement drops. Learning suffers.

2. **Screen-only learning is disembodied** -- apps like Khan Academy are great, but tapping a screen is passive. Kids learn best when they can *touch*, *hear*, *shake*, and *see* results in the physical world.

3. **Coding platforms ignore other subjects** -- Scratch, Code.org, and Tynker teach coding in isolation. But math is coding. Music is patterns. Science is measurement. Art is coordinates. The subjects aren't separate -- kids learn better when they're connected.

4. **AI tutors are expensive or shallow** -- Khanmigo costs $44/year per student. Most AI tutors are chatbots that don't remember the child or adapt over time. None connect to physical hardware.

5. **Homeschool parents need structure** -- 3.7M+ kids are homeschooled in the US. Parents want curriculum that's engaging, standards-aligned, and doesn't require them to be experts in every subject.

6. **Hardware education is fragmented** -- M5Stack makes amazing devices but has no kid-friendly curriculum. Arduino has curriculum but targets older students. micro:bit has great K-8 content but no AI integration or multi-subject coverage.

### The Opportunity

Nobody is combining **open-source curriculum + personalized AI + physical hardware + multi-subject learning for K-6**. That's TinkerSchool.

---

## 3. Target Users

### Primary: The Child (Cassidy, age 7, 1st Grade)
- Learning to read fluently, building math foundations
- Curious, creative, loves making things and showing them off
- Attention span: 15-30 minutes per session
- Wants instant, tangible results ("look what I made!")
- Learns best through stories, games, and hands-on activities
- No prior coding experience required

### Secondary: The Parent/Homeschool Teacher
- May or may not have technical background
- Wants structured, standards-aligned curriculum (Common Core, NGSS)
- Needs to see learning outcomes and progress across subjects
- Values screen time that produces real learning
- Wants to participate alongside their child or review asynchronously
- Budget-conscious -- drawn to open-source and affordable hardware

### Tertiary: Educators & Community Contributors
- Homeschool co-op leaders organizing group learning
- Teachers looking for STEM/cross-subject enrichment activities
- Open-source contributors building lessons, widgets, and hardware accessories
- YouTube creators making tutorial content

---

## 4. The M5StickC Plus 2: The Classroom in Your Hand

### Why This Device?

The M5StickC Plus 2 is a complete computer that fits in a child's hand. Every sensor and output maps to learning across *every* subject:

| Feature | Specs | Learning Applications |
|---|---|---|
| **Color Display** | 1.14" TFT, 135x240, ST7789V2 | Flashcards, animations, pixel art, graphs, spelling words, sheet music |
| **2 Buttons (A + B)** | Tactile, satisfying click | Quiz answers, navigation, note playing, yes/no, counting |
| **Buzzer/Speaker** | Frequency control, tones | Phonics sounds, musical notes, math celebration, sound experiments |
| **6-Axis IMU** | MPU6886 accelerometer + gyro | Gravity demos, motion games, tilt-to-sort, shake-to-shuffle, dance |
| **LED** | Single-color, brightness control | Morse code, even/odd indicator, light experiments |
| **IR Transmitter** | 38kHz modulated | Communication concepts, encoding/decoding |
| **Microphone** | SPM1423 | Clap detection, volume measurement, sound science |
| **WiFi + BLE** | ESP32, 2.4GHz | Multiplayer games, data sharing, spelling bees |
| **USB-C** | CH9102 serial chip | Direct browser connection via Web Serial API |
| **Battery** | 200mAh Li-Po | Portable -- learn anywhere, take outside for science |
| **Size** | 48 x 25 x 13mm | Fits in a kid's hand, wearable with strap |

### Cross-Subject Device Usage Map

| Device Feature | Math | Reading | Science | Music | Art | Problem Solving | Coding |
|---|---|---|---|---|---|---|---|
| **Display** | Number lines, shapes, graphs | Sight words, letters | Weather logs, diagrams | Note names, staff | Pixel art, patterns | Puzzles, mazes | Code output |
| **Buttons** | +1/-1 counting, answer | Flip cards, next word | Record data | Play notes | Pick colors | Yes/no logic | Run/stop |
| **Buzzer** | Count-along beeps | Letter sounds, phonics | Sound/vibration demo | Compose, play | - | Audio clues | Sound effects |
| **IMU** | Tilt to sort numbers | Shake to shuffle | Measure gravity | Shake percussion | Motion drawing | Tilt puzzles | Sensor input |
| **LED** | Even/odd flash | Correct/wrong | Brightness experiment | Beat pulse | - | Morse code | Status light |
| **WiFi** | Math duels | Spelling bee PvP | Share measurements | Jam sessions | Gallery share | Team puzzles | IoT projects |
| **Mic** | - | Read-aloud detection | Measure volume | Rhythm clap | - | Sound puzzles | Audio input |

### Device Is Optional (Simulator Mode)

Every lesson works in two modes:
1. **Device Mode** -- full experience with physical hardware (recommended)
2. **Simulator Mode** -- virtual M5StickC Plus 2 in the browser, all features emulated

This means any child with a web browser can start learning immediately. The device *enhances* the experience but doesn't gate it.

### Recommended Starter Kit (Hardware Store)

| Item | Use Case | Est. Cost |
|---|---|---|
| M5StickC Plus 2 | Core device | ~$22 |
| USB-C Cable | Browser connection | ~$5 |
| ENV III HAT (temp/humidity) | Science experiments | ~$10 |
| Joystick HAT | Games, navigation | ~$10 |
| 3D-Printed Case (our design) | Protection, personalization | ~$3 (print cost) |
| **Starter Kit Total** | | **~$50** |

---

## 5. Platform Architecture

### 5.1 System Overview

```
+--------------------------------------------------------------+
|                      TinkerSchool.ai                         |
|                                                               |
|  +------------+  +-----------+  +------------------+          |
|  | Lesson      |  | Workshop  |  | My Device        |          |
|  | Explorer    |  | (Code +   |  | (Simulator or    |          |
|  | (All        |  |  Blocks)  |  |  Live Preview)   |          |
|  | Subjects)   |  +-----------+  +------------------+          |
|  +------------+                                               |
|                                                               |
|  +------------+  +-----------+  +------------------+          |
|  | Chip        |  | Artifact  |  | Achievement      |          |
|  | (AI Tutor)  |  | Library   |  | & Progress       |          |
|  +------------+  +-----------+  +------------------+          |
|                                                               |
|  +------------+  +-----------+  +------------------+          |
|  | Parent      |  | Community |  | Hardware         |          |
|  | Dashboard   |  | Hub       |  | Store            |          |
|  +------------+  +-----------+  +------------------+          |
+--------------------------------------------------------------+
```

### 5.2 Key Components

1. **Lesson Explorer** -- Browse curriculum by subject (Math, Reading, Science, Music, Art, Problem Solving, Coding) or by cross-subject "Quests" that combine multiple subjects
2. **Workshop** -- Code editor (Blockly blocks + MicroPython text), connected to device or simulator
3. **Device Panel** -- Live preview/simulator of M5StickC Plus 2, Flash to Device button
4. **Chip (AI Tutor)** -- Persistent, personalized AI companion that knows the child across all sessions and subjects
5. **Artifact Library** -- Community-shared interactive widgets, quizzes, mini-games generated by Chip or created by educators
6. **Achievement & Progress** -- Cross-subject progress tracking, badges, streaks, learning milestones
7. **Parent Dashboard** -- Multi-subject analytics, AI conversation review, learning reports, curriculum management
8. **Community Hub** -- Open-source lesson contributions, educator forums, hardware project sharing
9. **Hardware Store** -- Recommended kits, 3D print files, sensor accessories

### 5.3 Tech Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | RSC, streaming, fast |
| React | React + RSC | 19.x | Server-first rendering |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first, kid-friendly theming |
| UI Components | shadcn/ui (Radix) + Framer Motion | latest | Accessible, animated |
| Block Editor | Google Blockly + react-blockly | 12.x / 7.x | Visual coding engine |
| Text Editor | Monaco Editor | 0.52.x | "Peek behind the curtain" |
| AI | Claude API (Anthropic) + AI SDK | latest | Personalized AI tutor |
| Auth | Clerk (Organizations + metadata) | 6.x | Parent/kid account model |
| Database | Supabase (PostgreSQL + RLS) | latest | Progress, profiles, real-time |
| Device Connection | Web Serial API | Chrome 89+ | Browser-to-device USB |
| Terminal | xterm.js | 5.x | REPL interaction |
| Firmware Flash | esptool-js | 0.5.x | Browser-based firmware flash |
| Testing | Vitest + Playwright | latest | Unit + E2E |
| Hosting | Vercel | - | Edge, ISR, fast deploys |

### 5.4 Device Communication Flow

```
Browser (TinkerSchool.ai)
    |
    |-- Web Serial API (USB) --> M5StickC Plus 2
    |
    |-- OR: WiFi (same network) --> M5StickC Plus 2
    |
    |-- OR: Simulator (no device needed)
```

---

## 6. AI Personalization System: Chip

### 6.1 Chip -- Your Personal AI Tutor

**Chip** is not just a chatbot. Chip is a persistent AI companion that gets to know each child deeply and adapts everything -- content, difficulty, pacing, examples, encouragement -- to that specific child.

**Personality:**
- Enthusiastic but patient -- never rushes, never talks down
- Asks questions before giving answers ("What do you think will happen?")
- Celebrates effort over outcomes ("You tried 4 different ways! That's what real scientists do!")
- Uses the child's interests in explanations ("Since you love dinosaurs, imagine each T-Rex tooth is worth 10 points...")
- Admits when things are hard ("This is a tricky one! Let's figure it out step by step")
- Never gives complete solutions -- guides through leading questions and hints
- Cross-subject connector ("Remember in music how we counted beats? Math uses the same counting!")

### 6.2 Student Learning Profile

Chip builds and maintains a **Learning Profile** for each child that evolves over time:

```
Student Learning Profile
|
+-- Identity
|   +-- Name, age, grade level
|   +-- Avatar choice, preferred colors
|   +-- Language/communication preferences
|
+-- Learning Style (discovered over time)
|   +-- Visual (prefers diagrams, colors, animations)
|   +-- Auditory (prefers sounds, spoken explanations, music)
|   +-- Kinesthetic (prefers shaking, tilting, physical interaction)
|   +-- Reading/Writing (prefers text, writing, spelling)
|   +-- Current blend: e.g., 40% kinesthetic, 30% visual, 20% auditory, 10% R/W
|
+-- Subject Proficiency Map
|   +-- Math
|   |   +-- Counting: mastered
|   |   +-- Addition (within 10): proficient
|   |   +-- Addition (within 20): developing
|   |   +-- Subtraction: beginning
|   |   +-- Shapes: proficient
|   |   +-- Time: not started
|   |
|   +-- Reading
|   |   +-- Letter recognition: mastered
|   |   +-- CVC words: proficient
|   |   +-- Sight words (Tier 1): developing
|   |   +-- Comprehension: beginning
|   |   ...
|   +-- Science, Music, Art, Problem Solving, Coding...
|
+-- Interests & Motivators
|   +-- Topics: ["dinosaurs", "space", "animals", "building"]
|   +-- Reward preferences: [badges, sounds, animations]
|   +-- Session length preference: ~20 min
|   +-- Best time of day: morning
|
+-- Growth Areas (where Chip provides extra support)
|   +-- Specific skills needing practice
|   +-- Common error patterns (e.g., reverses b/d in reading)
|   +-- Frustration triggers and coping strategies
|
+-- Session History
    +-- Lessons completed, time spent, accuracy
    +-- Artifacts generated and effectiveness
    +-- Conversation highlights for parent review
```

### 6.3 How Chip Personalizes

| Aspect | How It Adapts |
|---|---|
| **Difficulty** | Chip adjusts problem complexity in real-time. If a child gets 3 in a row correct, it gets slightly harder. 2 wrong, it scaffolds down. |
| **Content** | "You love dinosaurs! Let's count how many bones a Stegosaurus has." Math problems use the child's interests as context. |
| **Modality** | For a kinesthetic learner: "Shake the device to see the answer!" For a visual learner: "Watch the number line on screen." |
| **Pacing** | Some kids need 3 examples, some need 10. Chip adjusts the number of practice problems per concept. |
| **Cross-subject** | "In music, we learned about patterns -- do re mi do re mi. Can you find the pattern in these numbers? 2 4 6 2 4 6" |
| **Encouragement** | Chip tracks what kind of praise motivates each child and adjusts (some kids like high-fives, some like quiet "nice work"). |
| **Artifacts** | Chip generates custom interactive widgets -- a math quiz with dinosaur themes, a phonics game with space sounds. |

### 6.4 AI Interaction Modes

| Mode | When | Behavior |
|---|---|---|
| **Lesson Guide** | During structured lessons | Introduces concepts, guides activities, checks understanding |
| **Practice Coach** | During exercises | Adjusts difficulty, provides hints, celebrates progress |
| **Bug Detective** | When code doesn't work | "Let's look at this together. What do you think line 3 does?" |
| **Vibe Creator** | Free-build mode | "Tell me what you want to learn about and I'll create something just for you!" |
| **Explainer** | When kid asks "why?" | First-principles explanations with analogies tailored to interests |
| **Cross-Subject Connector** | Between subjects | "This music pattern is just like the math pattern we learned!" |
| **Artifact Builder** | Generating custom content | Creates interactive widgets, quizzes, games personalized to the child |

### 6.5 Artifact Generation

Chip can generate **Artifacts** -- interactive, self-contained learning widgets that run in the browser and/or on the device:

**Types of Artifacts:**
- **Flashcard Decks** -- custom flashcards with the child's interests woven in
- **Mini-Quizzes** -- adaptive difficulty, instant feedback, device buzzer for correct answers
- **Interactive Widgets** -- drag-and-drop, animation-based learning tools
- **Device Programs** -- MicroPython programs that run on the M5StickC Plus 2
- **Practice Generators** -- infinite practice problems in a specific skill area
- **Story Problems** -- narrative math/reading problems using the child's favorite topics

Every artifact gets saved to the child's library and tagged for the community warehouse.

### 6.6 Safety & Guardrails

- All AI responses filtered for age-appropriateness
- Conversation stays on-topic: learning subjects, creative projects, general knowledge
- Parent dashboard shows full conversation history with AI-generated summaries
- Rate limiting to prevent excessive screen time (configurable by parent)
- "Ask a grown-up" mode for questions outside Chip's educational scope
- No internet access beyond the curriculum -- Chip can't browse the web or access external content
- Content safety: no violence, no inappropriate topics, no personal data collection beyond learning profile

---

## 7. First Grade Curriculum (MVP)

### 7.1 Curriculum Design Philosophy

**Standards Alignment:**
- Math: Common Core State Standards, Grade 1 (1.OA, 1.NBT, 1.MD, 1.G)
- Reading/ELA: Common Core ELA, Grade 1 (RF.1, RL.1, RI.1, L.1, W.1)
- Science: Next Generation Science Standards, Grade 1 (1-PS4, 1-LS1, 1-LS3, 1-ESS1)
- Music, Art, Problem Solving: aligned with National Core Arts Standards and ISTE Standards

**The Three Questions (Every Lesson):**
1. **What** are we exploring? (the fun part -- a project, a game, a creation)
2. **How** does it work? (the learning part -- concepts, skills, practice)
3. **Why** does it matter? (the connection -- real-world applications, cross-subject links)

**Lesson Structure (15-25 minutes each):**
1. **Story Hook** (2-3 min) -- Chip introduces a scenario or challenge
2. **Explore** (5-8 min) -- Interactive activity using device or simulator
3. **Practice** (5-8 min) -- Guided exercises with adaptive difficulty
4. **Create** (3-5 min) -- Open-ended application of the concept
5. **Celebrate** (1-2 min) -- Review what was learned, earn progress, Chip summarizes for parent

### 7.2 Cross-Subject Integration Map

A key differentiator of TinkerSchool is that subjects are *connected*, not siloed:

```
           Math
          / | \
       /   |   \
    Reading -- Science
      |    \ /    |
      |   Music   |
      |    / \    |
    Art -- Problem Solving -- Coding
```

**Example cross-subject connections in 1st Grade:**
- Math patterns (2, 4, 6, 8) = Music rhythms (da-da-DA, da-da-DA)
- Reading letter shapes = Art drawing curves and lines
- Science measurement = Math counting and comparing
- Coding sequences = Music note sequences = Math number sequences
- Problem decomposition = Reading story structure (beginning, middle, end)

---

### 7.3 MATH -- "Number World" (10 Lessons)

**Standards:** Common Core 1.OA, 1.NBT, 1.MD, 1.G

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| M1 | **Counting Machine** | Counting to 50, number recognition | Display shows numbers, buttons count +1/-1, buzzer beeps per count | Click buttons on virtual device |
| M2 | **Number Neighbors** | Number lines, before/after, between | Display shows number line, tilt to scroll left/right | Drag to scroll |
| M3 | **Addition Adventure** | Addition within 10, number bonds | Shake to generate problems, buttons choose answer, celebration sound | Click to answer |
| M4 | **Subtraction Safari** | Subtraction within 10, taking away | Display shows objects disappearing, buzzer counts down | Animation on screen |
| M5 | **Tens and Ones Tower** | Place value, tens and ones | Display shows base-10 blocks, tilt to group/ungroup | Drag to group |
| M6 | **Addition Express** | Addition within 20, strategies | Speed round on display, buttons for answers, IMU shake for hint | Timed quiz |
| M7 | **Shape Explorer** | 2D shapes, attributes | Display draws shapes, tilt to rotate, buttons to change | Click to rotate |
| M8 | **Measure It!** | Comparing lengths, non-standard units | IMU measures tilt angle as "units", display shows comparison | Virtual ruler |
| M9 | **Clock Builder** | Telling time (hours) | Display shows analog clock, tilt to move hands | Drag clock hands |
| M10 | **Math Quest** (capstone) | Review all concepts, mixed problems | Chip generates personalized review based on growth areas | Full interactive review |

**Device Enhancement Examples:**
- **Counting Machine**: Each button press makes the buzzer beep and the number on screen increments. The physicality of pressing + hearing + seeing creates multi-sensory counting.
- **Shape Explorer**: Tilting the device rotates the shape on screen. Kids physically feel the rotation while seeing it -- connecting kinesthetic and visual learning.
- **Measure It!**: Kids hold the device at different angles and the IMU reads the tilt. "Measure the tilt of your book!" brings measurement into the physical world.

---

### 7.4 READING & LANGUAGE ARTS -- "Word World" (10 Lessons)

**Standards:** Common Core RF.1, RL.1, L.1

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| R1 | **Letter Sounds** | Phonics review, consonant sounds | Display shows letter, buzzer plays sound hint, buttons flip through | Click through letters |
| R2 | **Vowel Valley** | Short vowels (a, e, i, o, u) | Display shows CVC word frames, buzzer plays vowel sounds | Audio buttons |
| R3 | **Word Builder** | Blending CVC words (cat, dog, run) | Display shows letter slots, tilt to scroll letters, press to lock | Drag letters |
| R4 | **Sight Word Sprint** | Dolch 1st grade sight words | Flashcard mode on display, shake to shuffle, buttons for "know"/"practice" | Click flashcards |
| R5 | **Rhyme Time** | Rhyming words, word families | Display shows word, buzzer plays word + rhyme options, choose match | Audio + click |
| R6 | **Spelling Bee** | Spelling common words | Display shows picture, buzzer says word, buttons spell letter-by-letter | Type spelling |
| R7 | **Sentence Builder** | Word order, capital letters, periods | Display shows scrambled words, tilt to rearrange | Drag to arrange |
| R8 | **Story Sequencing** | Beginning, middle, end | Display shows story scenes, buttons put in order | Drag to sequence |
| R9 | **Reading Buddy** | Reading comprehension, simple passages | Chip reads along, display highlights words, questions after | Read + answer |
| R10 | **Word Quest** (capstone) | Review all concepts, personalized | Chip generates review based on growth areas | Full interactive review |

**Device Enhancement Examples:**
- **Letter Sounds**: The buzzer produces a tone hint for each letter sound. "B" gets a low buzzy sound. "S" gets a hiss. Multi-sensory phonics.
- **Sight Word Sprint**: Shake the device to shuffle to a new word. The physical action of shaking makes flashcard practice active, not passive.
- **Spelling Bee**: Display shows a picture (e.g., a cat), the buzzer plays the word sound, and the child presses buttons to scroll through letters and spell it. Each correct letter gets a happy beep.

---

### 7.5 SCIENCE -- "Discovery Lab" (10 Lessons)

**Standards:** NGSS 1-PS4 (Waves), 1-LS1 (Structure/Function), 1-LS3 (Heredity), 1-ESS1 (Earth's Place)

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| S1 | **Sound Safari** | Sound comes from vibration | Buzzer plays tones, mic detects claps, display shows wave visualization | Audio + animation |
| S2 | **Loud and Quiet** | Volume, pitch, frequency | Buzzer plays different frequencies, buttons change pitch/volume | Slider controls |
| S3 | **Light and Shadow** | Light needed to see, shadows | LED on/off experiments, display shows light/dark scenes | Toggle light on screen |
| S4 | **Plant Parts** | Roots, stems, leaves, flowers | Display shows plant diagram, buttons label parts, quiz mode | Click to label |
| S5 | **Animal Homes** | Animals need food, water, shelter | Display shows habitats, tilt to explore different areas | Scroll/click |
| S6 | **Weather Watch** | Weather types, observation | ENV HAT reads temp/humidity, display logs daily weather | Manual data entry |
| S7 | **Sky Watchers** | Sun, moon, star patterns | Display simulates day/night sky, tilt to look around | Pan around sky |
| S8 | **Like Parent, Like Baby** | Heredity, offspring resemble parents | Display shows parent/baby animals, buttons match pairs | Click to match |
| S9 | **Build a Habitat** | Design an animal home | Free-build: combine display elements, test with buzzer alerts | Drag and drop |
| S10 | **Science Quest** (capstone) | Review all concepts | Chip generates personalized science review | Full interactive |

**Device Enhancement Examples:**
- **Sound Safari**: The buzzer demonstrates vibration directly -- kids can feel the device vibrating while hearing the sound. Then they clap and the mic picks it up. "See? Sound is vibration you can feel!"
- **Weather Watch**: With the ENV III HAT, kids measure *actual* temperature and humidity. They log real data to track weather patterns. "Today it's 72 degrees! Yesterday was 68. It's getting warmer!"
- **Light and Shadow**: The LED turns on and off while the display shows how shadows change. Kids move the device (IMU) and the "shadow" on screen moves. Physical cause, visual effect.

---

### 7.6 MUSIC -- "Sound Studio" (10 Lessons)

**Standards:** Aligned with National Core Arts Standards (Music: Creating, Performing, Responding)

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| MU1 | **Meet the Notes** | Musical notes (do, re, mi) | Buzzer plays each note, display shows note name + color, buttons change notes | Click notes |
| MU2 | **High and Low** | Pitch, frequency relationship | Tilt device up = higher pitch, down = lower, display shows wave | Slider control |
| MU3 | **Beat Keeper** | Steady beat, rhythm | Buzzer plays beat, buttons tap along, display shows rhythm dots | Click to tap |
| MU4 | **Pattern Songs** | Repeating patterns in music | Buzzer plays pattern, kid repeats with buttons, display shows sequence | Click sequence |
| MU5 | **Fast and Slow** | Tempo | Tilt device to change speed, buzzer adjusts tempo, display shows metronome | Slider for tempo |
| MU6 | **Loud and Soft** | Dynamics (forte, piano) | Shake harder = louder, gentle = softer, IMU controls volume | Click levels |
| MU7 | **My First Song** | Compose 4 notes | Buttons select notes, display shows staff, buzzer plays composition | Click to compose |
| MU8 | **Rhythm Patterns** | Quarter notes, half notes | Display shows rhythm notation, buttons tap pattern, buzzer confirms | Click patterns |
| MU9 | **Music and Math** | Patterns in music = patterns in math | Cross-subject: number patterns become melodies | Visual + audio |
| MU10 | **Concert Time** (capstone) | Perform a composed piece | Play created composition on device, record and share | Play in browser |

**Device Enhancement Examples:**
- **High and Low**: Tilting the device up makes the buzzer pitch go higher, tilting down makes it lower. Kids physically feel the relationship between position and pitch. The display shows a frequency wave that stretches and compresses.
- **Beat Keeper**: The buzzer plays a steady beat and the child presses a button in time. The display shows green dots for on-beat and red for off-beat. The IMU can also detect rhythmic shaking.
- **My First Song**: Each button press adds a note. The display shows a simple staff with the notes. Press both buttons to play it back. Kids create, hear, and see their music.

---

### 7.7 ART -- "Pixel Studio" (10 Lessons)

**Standards:** Aligned with National Core Arts Standards (Visual Arts: Creating, Presenting)

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| A1 | **Pixel Power** | Pixels are tiny squares of color | Display shows zoomed pixel grid, buttons change colors | Click pixels |
| A2 | **Color Mixing** | Primary colors, mixing | Display shows RGB values, buttons adjust R/G/B, screen fills with result | Sliders |
| A3 | **Shapes and Lines** | Basic shapes in art | Display draws shapes from code, buttons cycle shapes | Click to draw |
| A4 | **Pattern Maker** | Repeating patterns | Display shows pattern grid, tilt to shift pattern, buttons to cycle | Drag patterns |
| A5 | **Symmetry Art** | Mirror images, symmetry lines | Draw on one half of display, other half mirrors automatically | Click to draw |
| A6 | **Pixel Animals** | Creating recognizable images from pixels | Grid editor on display, buttons place/remove pixels | Click grid |
| A7 | **Animation Basics** | Frames, movement illusion | 2-3 frame animation on display, buttons to switch frames | Click to animate |
| A8 | **Color Moods** | Warm/cool colors, emotions | Display fills with color palettes, buzzer plays matching mood music | Select palettes |
| A9 | **Art and Math** | Coordinates, grids, geometry in art | Cross-subject: use x,y coordinates to place pixel art | Visual + code |
| A10 | **Gallery Show** (capstone) | Create and share artwork | Display original art, share to community gallery | Upload to gallery |

**Device Enhancement Examples:**
- **Color Mixing**: Buttons adjust RGB values (0-255) in steps. The display fills with the resulting color. Kids learn that ALL colors are made from red, green, and blue. "What happens if we turn red all the way up and blue all the way up?"
- **Symmetry Art**: Using buttons, kids draw on the left half of the 135x240 display. The right half automatically mirrors. Tilting the device changes the axis of symmetry (vertical, horizontal, diagonal).
- **Animation Basics**: Kids draw 2-3 frames of a simple animation (a ball bouncing). Pressing a button cycles through frames rapidly, creating the illusion of movement. "Movies are just pictures shown really fast!"

---

### 7.8 PROBLEM SOLVING & CRITICAL THINKING -- "Puzzle Lab" (10 Lessons)

**Standards:** Aligned with ISTE Standards for Students (Computational Thinker, Innovative Designer)

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| P1 | **Spot the Pattern** | Pattern recognition | Display shows number/shape patterns, buttons choose what's next | Click answer |
| P2 | **What Comes Next?** | Sequencing events | Display shows story frames, tilt to arrange in order | Drag to order |
| P3 | **Sort It Out** | Classification, grouping | Display shows items, tilt left/right to sort into buckets | Drag to sort |
| P4 | **Cause and Effect** | If this, then that | Display shows scenarios, buttons pick the effect, buzzer confirms | Click to match |
| P5 | **Break It Down** | Decomposition (big problem -> small steps) | Display shows complex task, buttons reveal step-by-step breakdown | Click to reveal |
| P6 | **Maze Runner** | Spatial reasoning, planning ahead | Display shows maze, tilt to navigate, buzzer on wall hit | Arrow keys |
| P7 | **Code the Robot** | Algorithms, sequential instructions | Give step-by-step commands, display shows robot following them | Visual programming |
| P8 | **Odd One Out** | Logical reasoning, attributes | Display shows items, buttons select the one that doesn't belong | Click to select |
| P9 | **Build a Solution** | Creative problem solving | Open-ended challenges, multiple correct approaches | Various |
| P10 | **Puzzle Quest** (capstone) | Review all thinking skills | Chip generates personalized puzzle review | Full interactive |

**Device Enhancement Examples:**
- **Maze Runner**: Tilting the device physically moves a dot through the maze on screen. Hit a wall? The buzzer sounds. Reach the end? Celebration sound + LED flash. The physical movement engages spatial reasoning.
- **Sort It Out**: Tilt the device left to put items in the "left bucket" and right for the "right bucket." Kids physically sort by tilting -- connecting movement to classification.
- **Code the Robot**: Kids press Button A for "forward" and Button B for "turn right." The display shows a robot following their instructions step by step. This bridges into coding concepts without writing code.

---

### 7.9 CODING -- "Code Lab" (10 Lessons)

**Inherited and evolved from the original CodeBuddy curriculum (Band 1-2)**

| # | Lesson | Concepts | Device Features | Simulator Alt |
|---|---|---|---|---|
| C1 | **Hello, Computer!** | What is a computer? Input/output | Explore buttons (input) and screen/buzzer (output) | Virtual device |
| C2 | **Color Your World** | Instructions, sequence | Blockly: set screen color, one instruction at a time | Visual blocks |
| C3 | **Name Tag** | Text, positioning, coordinates | Display your name on screen with color choices | On-screen |
| C4 | **Music Box** | Loops, patterns | Program the buzzer to play a melody using blocks | Audio in browser |
| C5 | **Tilt and Draw** | Sensors, real-time input | Use IMU to move a dot on screen (Etch-a-Sketch) | Mouse/touch |
| C6 | **Button Games** | Conditionals (if button A pressed...) | Build a reaction-time game with buttons | Click events |
| C7 | **Shake Magic** | Events, randomness | Shake for random answer (Magic 8-Ball) | Click to "shake" |
| C8 | **Animation Station** | Loops + display + timing | Animate sprites on the screen | Browser animation |
| C9 | **Free Build** | Open-ended creation | Vibe coding with Chip: "Tell me what you want to build!" | Full workshop |
| C10 | **Code Show** (capstone) | Present and explain a project | Demo project on device, explain to family | Screen share |

---

### 7.10 Cassidy's First Week at TinkerSchool

Here's what a typical first week looks like, mixing subjects daily:

**Day 1: "Welcome to TinkerSchool!" (25 min)**
- Set up account, meet Chip, choose avatar
- Math M1: Counting Machine (10 min)
- Reading R1: Letter Sounds (10 min)
- Earn "Welcome" badge

**Day 2: "Sounds Everywhere" (25 min)**
- Science S1: Sound Safari (12 min) -- discover sound is vibration
- Music MU1: Meet the Notes (12 min) -- cross-subject connection!
- Chip: "See? Music and science are connected! Sound IS vibration!"

**Day 3: "Shapes and Pixels" (25 min)**
- Math M7: Shape Explorer (12 min) -- learn 2D shapes
- Art A1: Pixel Power (12 min) -- shapes made of tiny squares
- Chip: "A square on screen is made of pixels. Shapes are everywhere!"

**Day 4: "Patterns Everywhere" (25 min)**
- Problem Solving P1: Spot the Pattern (10 min)
- Music MU4: Pattern Songs (10 min)
- Coding C4: Music Box (10 min) -- code a pattern!
- Chip: "Patterns are in math, music, AND code!"

**Day 5: "Free Explore Friday" (30 min)**
- Kid's choice: revisit any subject or free build with Chip
- Chip generates a personalized artifact based on the week's learning
- Show & Tell with family
- Earn "First Week" badge
- Parent reviews progress dashboard

---

### 7.11 Adaptive Difficulty Levels

Within each lesson, Chip adjusts difficulty based on the child's proficiency:

| Level | Description | Example (Math M3: Addition) |
|---|---|---|
| **Seed** | Maximum scaffolding, visual supports | "2 + 1 = ?" with number line, counting dots shown |
| **Sprout** | Some scaffolding, fewer hints | "3 + 4 = ?" with number line available on request |
| **Bloom** | Independent practice, minimal hints | "7 + 5 = ?" with just the problem and answer input |
| **Flourish** | Challenge mode, extensions | "? + 6 = 14" (missing addend, reverse thinking) |

Chip determines the starting level from the Learning Profile and adjusts dynamically within each session.

---

## 8. Website UX Design

### 8.1 Design Principles

1. **Big, friendly, colorful** -- Large touch targets, bright colors, playful illustrations, round corners
2. **Minimal reading required** -- Icons, images, and Chip's voice supplement text
3. **Instant feedback** -- Every action produces a visible or audible result
4. **Safe to fail** -- Undo everything, nothing breaks permanently
5. **Subject colors** -- Each subject has a distinct color for instant recognition:
   - Math: Blue
   - Reading: Green
   - Science: Orange
   - Music: Purple
   - Art: Pink
   - Problem Solving: Yellow
   - Coding: Teal
6. **Parent co-pilot** -- Parent can sit alongside or check in asynchronously

### 8.2 Key Screens

#### Landing Page (tinkerschool.ai)
- Hero: "The Classroom in Your Hand" with M5StickC Plus 2 hero image
- Chip character introduction with animated personality
- Subject carousel showing all 7 subject areas
- "Try Free in Your Browser" CTA (simulator mode, no account needed)
- "Get the Kit" CTA linking to hardware store
- Testimonials, curriculum overview, open-source philosophy
- SEO-optimized for: "homeschool learning platform", "AI tutor for kids", "hands-on STEM education"

#### Home / Mission Control (Authenticated)
- Child's avatar and Chip greeting (personalized: "Good morning Cassidy! Ready to explore numbers today?")
- **Today's Learning Path** -- Chip's recommended lessons based on proficiency and interests
- Subject cards with progress bars (Math: 40%, Reading: 30%, etc.)
- Current streak and recent badges
- Device status: "M5Stick connected" / "Using simulator" / "Plug in your M5Stick!"
- Quick links: Free Build, Artifact Library, Gallery

#### Lesson View
- **Top**: Subject badge + lesson title + progress bar
- **Left**: Chip's panel (story narration, hints, questions, encouragement)
- **Center**: Interactive content area (activity, quiz, device interaction)
- **Right**: Device simulator/preview (what the M5StickC screen shows)
- **Bottom**: Controls (next, back, hint, ask Chip)
- For coding lessons: Blockly editor replaces center panel

#### Workshop (Code + Build)
- Full-screen code editor (Blockly or MicroPython)
- Device simulator/preview panel
- Chip chat panel
- "Flash to Device" button (big, satisfying, with rocket animation)
- "Share to Gallery" button

#### Parent Dashboard
- **Overview**: All children's progress across all subjects, time spent, sessions completed
- **Per-Subject**: Deep dive into each subject's skill map with mastery levels
- **AI Review**: Chip's conversation logs with AI-generated summaries
- **Reports**: Printable/downloadable progress reports (weekly/monthly)
- **Settings**: Time limits, subject priorities, difficulty preferences, device management

### 8.3 Accessibility

- Dyslexia-friendly font option (OpenDyslexic)
- Text-to-speech for all lesson content (Chip reads aloud)
- High contrast mode
- Keyboard navigation support
- Adjustable text size
- Audio descriptions for visual content
- Color-blind friendly palette (shapes + labels, not just colors)

---

## 9. Artifact & Widget System

### 9.1 What Are Artifacts?

Artifacts are **self-contained, interactive learning modules** that Chip generates or educators create. They're like mini-apps that focus on a specific skill or concept.

**Examples:**
- A math flashcard deck themed around dinosaurs (generated by Chip for a dino-loving kid)
- An interactive spelling game where the buzzer sounds out letters
- A pixel art canvas preset with a grid for drawing animals
- A science data logger that records temperature every 5 minutes
- A rhythm game that plays a beat and the child taps along

### 9.2 Artifact Types

| Type | Runs On | Description |
|---|---|---|
| **Web Widget** | Browser only | HTML/CSS/JS interactive tool, no device needed |
| **Device Program** | M5StickC Plus 2 | MicroPython program that runs on the hardware |
| **Hybrid** | Browser + Device | Web interface that communicates with the device |
| **Printable** | Paper | PDF worksheets, coloring pages, activity sheets |
| **Audio** | Browser | Narrated stories, phonics drills, music samples |

### 9.3 Community Warehouse

Every artifact gets tagged and stored in a community warehouse:

```
Artifact Metadata:
  - Title: "Dino Math: Addition to 20"
  - Subject: Math
  - Skill: Addition within 20
  - Grade: 1st
  - Type: Web Widget
  - Tags: ["dinosaurs", "addition", "interactive"]
  - Created by: Chip (for Cassidy)
  - Rating: 4.8/5 (from 23 uses)
  - Device Required: No
  - Difficulty: Sprout-Bloom
```

Parents and educators can browse the warehouse, filter by subject/skill/grade, and assign artifacts to their children. Popular artifacts rise to the top.

### 9.4 Open Source Contribution Model

Educators and developers can contribute:
- **Lessons** -- full lesson plans with activities and assessments
- **Artifacts** -- interactive widgets and device programs
- **Hardware Designs** -- 3D print files for cases, mounts, sensor accessories
- **Translations** -- localize content for other languages
- **Curriculum Packs** -- themed lesson collections (e.g., "Ocean Science Week")

All contributions are CC BY-SA 4.0 licensed (free to use, share, and adapt with attribution).

---

## 10. Community & Open Source Model

### 10.1 Open Source Philosophy

TinkerSchool's curriculum, platform code, and hardware designs are open source:

| Component | License | Repository |
|---|---|---|
| Platform code | MIT | github.com/tinkerschool/platform |
| Curriculum content | CC BY-SA 4.0 | github.com/tinkerschool/curriculum |
| Hardware designs (3D prints, PCBs) | CERN OHL-S v2 | github.com/tinkerschool/hardware |
| AI system prompts | CC BY-SA 4.0 | Part of platform repo |

### 10.2 Community Hub Features

- **Forum** -- parents, educators, and contributors discuss curriculum, share tips, ask questions
- **Lesson Marketplace** -- free community-contributed lessons alongside curated official curriculum
- **Hardware Projects** -- community-submitted M5StickC Plus 2 projects beyond the curriculum
- **YouTube Integration** -- official tutorials, project walkthroughs, parent guides embedded in relevant lessons
- **Monthly Challenges** -- themed learning challenges (e.g., "Space Month: Learn astronomy across all subjects!")

### 10.3 Contribution Workflow

1. Contributor creates a lesson/artifact/hardware design
2. Submits via GitHub PR or web form
3. Community review + moderator approval
4. Published to the Community Hub with attribution
5. Usage metrics track effectiveness (completion rate, kid satisfaction, learning outcomes)
6. Top contributors get recognition (contributor profiles, badges, featured slots)

---

## 11. Business Model

### 11.1 Revenue Streams

| Stream | Description | Pricing | Timeline |
|---|---|---|---|
| **Free Tier** | Full 1st grade curriculum, simulator mode, basic Chip AI (limited daily tokens), community artifacts | $0 | Launch |
| **Hardware Kits** | M5StickC Plus 2 + accessories + 3D-printed parts, shipped as starter/expansion kits | $50-$100 per kit | Launch |
| **Premium AI** | Unlimited Chip conversations, advanced personalization, artifact generation, detailed analytics | $9.99/month or $79/year per family | Month 2 |
| **YouTube Channel** | Tutorials, parent guides, kid project showcases, sponsor revenue | Ad/sponsor revenue | Month 1 |
| **3D Print Files** | Premium STL files for custom device cases, sensor mounts, themed accessories | $2-$10 per design | Month 3 |
| **Educator Tier** | Bulk pricing, classroom management, multi-student dashboards, custom curriculum tools | $4.99/student/month | Month 6 |
| **Curriculum Packs** | Premium themed lesson packs (e.g., "Space Explorers: 4-Week Cross-Subject Journey") | $9.99-$19.99 per pack | Month 4 |

### 11.2 Pricing Philosophy

- **Core learning is always free** -- every child should have access to a complete 1st grade education
- Hardware is the primary initial revenue -- physical products have clear value
- Premium AI and content are "nice to have" enhancements, not gates on learning
- Community contributions keep content growing without proportional cost
- YouTube builds brand awareness and trust, driving organic growth

### 11.3 Cost Structure

| Expense | Monthly Est. | Notes |
|---|---|---|
| Claude API (AI) | $200-$2,000 | Scales with users, rate-limited on free tier |
| Supabase | $25-$100 | Free tier covers early growth |
| Vercel hosting | $0-$20 | Free tier initially |
| Hardware COGS | 60% of kit price | Margin on kits |
| 3D printing materials | <$1 per case | If self-printed |
| Domain + email | $20/year | tinkerschool.ai |

---

## 12. MVP Scope & Phasing

### Phase 1: Foundation (Weeks 1-4)
- [x] Next.js 15 project setup with App Router
- [x] Clerk auth (parent + kid profiles with PIN)
- [x] Supabase database with RLS policies
- [x] Web Serial API device connection
- [x] Blockly editor with M5StickC custom blocks
- [x] Device simulator
- [x] esptool-js firmware flash
- [ ] **Rebrand to TinkerSchool** (landing page, new color scheme, Chip character)
- [ ] **Student Learning Profile** schema + initial Chip prompts
- [ ] **Lesson viewer** that supports multi-subject content (not just coding)

### Phase 2: 1st Grade Curriculum (Weeks 5-10)
- [ ] Math: 10 lessons ("Number World")
- [ ] Reading: 10 lessons ("Word World")
- [ ] Science: 10 lessons ("Discovery Lab")
- [ ] Music: 10 lessons ("Sound Studio")
- [ ] Art: 10 lessons ("Pixel Studio")
- [ ] Problem Solving: 10 lessons ("Puzzle Lab")
- [ ] Coding: 10 lessons ("Code Lab")
- [ ] Cross-subject "Quests" linking related lessons
- [ ] Adaptive difficulty system (Seed/Sprout/Bloom/Flourish)

### Phase 3: AI Personalization (Weeks 8-12)
- [ ] Chip Learning Profile system (stores and retrieves per-child data)
- [ ] Interest-based content adaptation ("dinosaur math problems")
- [ ] Cross-subject connection prompts
- [ ] Artifact generation (Chip creates custom widgets)
- [ ] Parent AI conversation review + summaries

### Phase 4: Community & Growth (Weeks 12-16)
- [ ] Artifact Library (browse, search, assign)
- [ ] Community Hub (forums, contributions)
- [ ] YouTube channel launch
- [ ] Hardware store page (affiliate or direct)
- [ ] 3D print file library
- [ ] Educator tier (multi-student management)

### Phase 5: Expand Curriculum (Ongoing)
- [ ] Kindergarten curriculum (all subjects)
- [ ] 2nd grade curriculum (all subjects)
- [ ] Grades 3-6 (progressive rollout)
- [ ] Additional hardware (M5Stack Core2, sensors, kits)
- [ ] i18n (Spanish first, then community-driven translations)

---

## 13. Future Grade Levels (Preview)

### Kindergarten (Ages 5-6) -- "Little Explorers"
- Counting to 20, letter recognition, nature observation, musical play, finger painting on screen, simple sequencing
- Heavy audio/visual support, minimal reading required
- Device as "magic wand" that responds to simple interactions

### 2nd Grade (Ages 7-8) -- "Master Builders"
- Addition/subtraction to 100, reading fluency, life cycles, instrument exploration, digital art, multi-step problems
- Introduction to MicroPython "peek behind the curtain"
- More complex device projects (multi-sensor, WiFi)

### 3rd-4th Grade (Ages 8-10) -- "Inventors"
- Multiplication, fractions, chapter books, earth science, music composition, animation, coding logic
- Text-based programming alongside blocks
- IoT projects, data logging, simple networking

### 5th-6th Grade (Ages 10-12) -- "Creators"
- Pre-algebra, research writing, physics, music production, digital design, algorithms
- Full MicroPython + AI vibe coding
- Capstone projects, community teaching, mentoring younger students

---

## 14. Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Cassidy completes first cross-subject day | Day 1 | Completion tracking |
| Child asks to use TinkerSchool unprompted | Within first week | Parent survey |
| Subjects attempted per week | 3+ (of 7) | Usage analytics |
| Session length (average) | 20-30 minutes | Time tracking |
| Sessions per week | 4-5 | Usage analytics |
| Lesson completion rate | >80% | Progress tracking |
| Cross-subject connections noticed by child | 2+ per week | Chip conversation analysis |
| Parent satisfaction (would recommend) | >90% | Survey |
| "Mom look what I made!" moments per week | 3+ | Parent survey |
| Community artifacts contributed (month 6) | 100+ | Community metrics |
| YouTube subscribers (month 6) | 1,000+ | YouTube analytics |
| Hardware kits sold (month 6) | 200+ | Sales |
| Free tier signups (month 6) | 2,000+ | Auth metrics |
| Premium conversions (month 6) | 10% of free users | Subscription data |

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **AI says something inappropriate** | Trust destroyed | Pre-filtered responses, strict topic guardrails, parent review, rate limiting |
| **Content too hard or too easy** | Disengagement | Adaptive difficulty (4 levels), Chip adjusts in real-time, parent can override |
| **USB/Serial connection is finicky** | Kids frustrated | Simulator mode as default, excellent error messages, WiFi fallback |
| **Too many subjects = shallow content** | Learning suffers | Start with 10 high-quality lessons per subject, depth over breadth |
| **AI costs grow faster than revenue** | Unsustainable | Rate-limited free tier, prompt optimization, caching common responses |
| **M5StickC Plus 2 is discontinued** | Platform orphaned | Simulator-first design, abstract hardware layer, support multiple devices |
| **Parent can't help with setup** | Stuck on day 1 | Video setup guide, zero-config wizard, "Try Free" simulator needs no setup |
| **Screen time concerns** | Parents hesitate | Time limits (configurable), "take a break" prompts, offline printable activities |
| **Open source contributions are low quality** | Moderation burden | Review process, community ratings, moderator approval, quality templates |
| **Competition from Khanmigo / SchoolAI** | Market pressure | Hardware differentiator + open source + community moat + multi-subject integration |

---

## 16. Competitive Landscape

| Platform | Strengths | What TinkerSchool Adds |
|---|---|---|
| **Khan Academy / Khanmigo** | Massive library, trusted brand, AI tutor | Physical hardware, open source, multi-sensory, deeper personalization |
| **Code.org** | Free, standards-aligned, huge reach | Not coding-only -- all subjects, physical device, AI tutor |
| **Scratch** | Creative, community, proven | Hardware connection, structured multi-subject curriculum, AI guidance |
| **SchoolAI** | AI tutoring with teacher tools | Physical hardware, open source, community-driven, not institution-locked |
| **MagicSchool** | Teacher-focused AI tools | Student-facing, hardware-integrated, cross-subject, open source |
| **micro:bit** | Physical computing for K-8 | AI tutor, multi-subject curriculum (not just coding), personalization |
| **IXL** | Standards-aligned practice | Boring. TinkerSchool makes learning physical and fun |
| **Tynker** | Game-based coding progression | Not coding-only, hardware-connected, open source, AI personalized |
| **OATutor** | Open-source adaptive tutoring | Hardware integration, K-6 focus, multi-subject, AI personalization |

**TinkerSchool's Unique Position:** The only platform combining **open-source + AI personalization + physical hardware + multi-subject K-6 curriculum**. This combination creates a moat that's hard to replicate because it requires expertise across education, AI, hardware, and community building.

---

## 17. Technical References & Resources

### M5StickC Plus 2
- [Official Product Page](https://shop.m5stack.com/products/m5stickc-plus2-esp32-mini-iot-development-kit)
- [Official Documentation](https://docs.m5stack.com/en/core/M5StickC%20PLUS2)
- [UIFlow2 Getting Started](https://uiflow-micropython.readthedocs.io/en/2.3.3/get-started/index.html)
- [MicroPython Examples (GitHub)](https://github.com/rafaPassarinho/micropython-m5stick)
- [M5Stack Community Forum](https://community.m5stack.com/)
- [Hackster.io M5Stack Projects](https://www.hackster.io/m5stack)

### Educational Standards
- [Common Core Math Grade 1](https://www.thecorestandards.org/Math/Content/1/)
- [Common Core ELA Grade 1](https://www.thecorestandards.org/ELA-Literacy/RF/1/)
- [NGSS 1st Grade Topics](https://www.nextgenscience.org/1st-grade-topics-model)
- [National Core Arts Standards](https://www.nationalartsstandards.org/)
- [ISTE Standards for Students](https://www.iste.org/standards/iste-standards-for-students)
- [CSTA K-12 CS Standards](https://www.csteachers.org/page/standards)

### AI-Powered Education
- [OATutor - Open Source Adaptive Tutoring](https://www.oatutor.io/)
- [Berkeley CAHL Lab (OATutor developers)](https://bse.berkeley.edu/leveraging-ai-improve-adaptive-tutoring-systems)
- [Khanmigo](https://www.khanmigo.ai/)
- [SchoolAI](https://schoolai.com/)
- [MagicSchool](https://www.magicschool.ai/)

### Hardware Education Platforms
- [micro:bit](https://microbit.org)
- [Arduino Education](https://www.arduino.cc/education/)
- [M5Stack Education](https://m5stack.com/)
- [Open Source Hardware Business Models](https://www.open-electronics.org/the-truth-about-open-source-hardware-business-models/)

### Kids Coding Platforms
- [Code.org](https://code.org)
- [Scratch](https://scratch.mit.edu)
- [Tynker](https://www.tynker.com)
- [CodeMonkey](https://www.codemonkey.com)

### Open Source Education
- [Open edX](https://openedx.org/)
- [OER Commons](https://www.oercommons.org/)
- [Creative Commons Education](https://creativecommons.org/about/program-areas/education/)

---

## 18. Open Questions

1. **Voice for Chip?** -- Should Chip have text-to-speech voice output? Would increase accessibility but adds complexity and cost.
2. **Offline mode?** -- PWA with cached lessons for areas with poor internet? Important for global reach.
3. **Multi-language?** -- English first, but design for i18n? Spanish as first additional language?
4. **Assessment model?** -- Portfolio-based (collect artifacts), mastery-based (skill proficiency), or hybrid?
5. **Physical workbook companion?** -- Printable activity books that complement digital lessons?
6. **Group/class mode?** -- Support for homeschool co-ops with 5-10 kids learning together?
7. **Chip avatar customization?** -- Let kids choose Chip's appearance (robot, animal, alien)?
8. **Device expansion?** -- Support M5Stack Core2, M5Stack Basic, or other ESP32 boards?
9. **Parental controls granularity?** -- Per-subject time limits? Block certain subjects? Reorder curriculum?
10. **Data portability?** -- Export learning profile for use with other platforms?

---

## 19. Next Steps

1. **Rebrand landing page** -- Deploy tinkerschool.ai with new vision, Chip character, subject showcase
2. **Update database schema** -- Add multi-subject support, learning profiles, artifact storage
3. **Build Lesson Viewer** -- Generic lesson component that works for any subject (not just coding)
4. **Write Math Module 1** -- "Counting Machine" as proof of concept for non-coding lessons
5. **Implement Chip Learning Profile** -- System prompt + profile storage + retrieval
6. **Build Artifact System** -- Template engine for interactive widgets
7. **Record YouTube launch video** -- "What is TinkerSchool?" explainer
8. **Design hardware kit** -- Define starter kit contents, source components, design 3D-printed case
9. **Alpha test with Cassidy** -- Full 1st-grade Week 1 experience
10. **Open source the curriculum** -- Set up public repos, contribution guidelines, CC license

---

## 20. Technical Architecture: Deep Dive

> **Note:** This section preserves and extends the detailed technical architecture from the original CodeBuddy PRD. All component names have been updated to TinkerSchool. The core stack (Next.js 15, React 19, Blockly, Clerk, Supabase, Web Serial, esptool-js) remains the same.

### 20.1 New Schema Additions (Multi-Subject + Learning Profiles)

The following tables extend the existing Supabase schema to support multi-subject learning and AI personalization:

```sql
-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,         -- 'math', 'reading', 'science', etc.
  name TEXT NOT NULL,                -- 'Number World'
  display_name TEXT NOT NULL,        -- 'Math'
  color TEXT NOT NULL,               -- '#3B82F6' (blue for math)
  icon TEXT NOT NULL,                -- 'calculator' | 'book' | 'flask' | etc.
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skills within subjects (granular tracking)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  slug TEXT NOT NULL,                -- 'addition_within_10'
  name TEXT NOT NULL,                -- 'Addition within 10'
  standard_code TEXT,                -- '1.OA.A.1' (Common Core alignment)
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (subject_id, slug)
);

-- Lessons belong to subjects (evolves existing lessons table)
-- Add columns to existing lessons table:
--   subject_id UUID REFERENCES subjects(id)
--   skills_covered UUID[] (array of skill IDs this lesson teaches)
--   lesson_type TEXT ('interactive' | 'quiz' | 'creative' | 'capstone')
--   device_required BOOLEAN DEFAULT false
--   device_features TEXT[] (e.g., ['display', 'buzzer', 'imu'])
--   simulator_support BOOLEAN DEFAULT true
--   estimated_minutes INTEGER

-- Student Learning Profile
CREATE TABLE learning_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  learning_style JSONB DEFAULT '{}',     -- { visual: 0.4, auditory: 0.3, kinesthetic: 0.2, rw: 0.1 }
  interests TEXT[] DEFAULT '{}',          -- ['dinosaurs', 'space', 'animals']
  preferred_session_length INTEGER,       -- minutes
  preferred_encouragement TEXT,           -- 'enthusiastic' | 'quiet' | 'humor'
  chip_notes TEXT,                        -- AI-generated notes about this learner
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (profile_id)
);

-- Skill proficiency tracking
CREATE TABLE skill_proficiency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id),
  level TEXT NOT NULL DEFAULT 'not_started',  -- 'not_started' | 'beginning' | 'developing' | 'proficient' | 'mastered'
  attempts INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (profile_id, skill_id)
);

-- Artifacts (community warehouse)
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,                      -- 'web_widget' | 'device_program' | 'hybrid' | 'printable' | 'audio'
  subject_id UUID REFERENCES subjects(id),
  skill_ids UUID[] DEFAULT '{}',
  grade_level INTEGER,
  tags TEXT[] DEFAULT '{}',
  content JSONB NOT NULL,                  -- The artifact definition (varies by type)
  device_required BOOLEAN DEFAULT false,
  difficulty TEXT,                          -- 'seed' | 'sprout' | 'bloom' | 'flourish'
  created_by UUID REFERENCES profiles(id),
  created_by_chip BOOLEAN DEFAULT false,   -- Was this generated by AI?
  source_profile_id UUID REFERENCES profiles(id),  -- If AI-generated, for whom?
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  family_id UUID REFERENCES families(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Artifact ratings
CREATE TABLE artifact_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (artifact_id, profile_id)
);
```

### 20.2 Updated Chip System Prompt Architecture

The AI system prompt now includes the student's Learning Profile for personalization:

```typescript
// lib/ai/chip-system-prompt.ts

interface ChipContext {
  childName: string;
  age: number;
  gradeLevel: number;
  currentSubject: string;
  currentLesson: string;
  learningProfile: {
    learningStyle: Record<string, number>;
    interests: string[];
    preferredEncouragement: string;
    chipNotes: string;
  };
  skillProficiency: Record<string, string>;  // skill_slug -> level
  recentActivity: string[];                   // Last 5 lessons/artifacts
}

function buildChipSystemPrompt(ctx: ChipContext): string {
  return `You are Chip, a friendly and encouraging AI tutor on TinkerSchool.
You are working with ${ctx.childName}, who is ${ctx.age} years old and in grade ${ctx.gradeLevel}.

## Your Personality
- Patient, enthusiastic, curious
- Ask questions before giving answers
- Celebrate effort over results
- Use analogies and examples from the child's interests
- Never give complete solutions -- guide through hints and leading questions
- Connect concepts across subjects when relevant

## Current Context
- Subject: ${ctx.currentSubject}
- Lesson: ${ctx.currentLesson}

## This Child's Learning Profile
- Learning style: ${JSON.stringify(ctx.learningProfile.learningStyle)}
  ${getStyleGuidance(ctx.learningProfile.learningStyle)}
- Interests: ${ctx.learningProfile.interests.join(', ')}
  USE THESE in examples and problems! "${ctx.childName} loves ${ctx.learningProfile.interests[0]}, so weave that into explanations."
- Encouragement style: ${ctx.learningProfile.preferredEncouragement}
- Your notes about this learner: ${ctx.learningProfile.chipNotes}

## Skill Levels
${Object.entries(ctx.skillProficiency).map(([skill, level]) => `- ${skill}: ${level}`).join('\n')}

## Rules
1. Stay on topic: learning subjects, creative projects, general knowledge
2. Age-appropriate language and content only
3. If asked about something outside your scope, say "That's a great question! Maybe ask a grown-up about that."
4. Never collect personal information beyond what's in the profile
5. Limit response length to 2-3 short paragraphs max for young children
6. Use simple words. If you must use a big word, define it.
7. Reference the M5StickC Plus 2 device when relevant to the lesson.`;
}
```

### 20.3 Multi-Subject Lesson Content Format

Lessons are stored as structured JSONB in the database:

```typescript
interface LessonContent {
  subject: string;
  title: string;
  estimatedMinutes: number;
  deviceFeatures: ('display' | 'buttons' | 'buzzer' | 'imu' | 'led' | 'mic' | 'wifi')[];
  simulatorSupport: boolean;

  sections: LessonSection[];
}

interface LessonSection {
  type: 'story' | 'explore' | 'practice' | 'create' | 'celebrate';
  title: string;
  chipDialogue: string;  // What Chip says to introduce this section
  content: SectionContent;
}

type SectionContent =
  | { kind: 'narrative'; text: string; illustration?: string }
  | { kind: 'interactive'; widgetType: string; config: Record<string, unknown> }
  | { kind: 'quiz'; questions: QuizQuestion[] }
  | { kind: 'device_activity'; code: string; instructions: string }
  | { kind: 'free_build'; prompt: string; starterCode?: string }
  | { kind: 'celebration'; badge?: string; chipMessage: string };

interface QuizQuestion {
  prompt: string;
  type: 'multiple_choice' | 'number_input' | 'drag_order' | 'tap_match';
  options?: string[];
  correctAnswer: string | number | string[];
  hint: string;
  chipFeedback: { correct: string; incorrect: string };
  deviceAction?: { correct: string; incorrect: string };  // e.g., buzzer sound
  difficulty: 'seed' | 'sprout' | 'bloom' | 'flourish';
  skillId: string;
}
```

### 20.4 Remaining Technical Architecture

> The following technical sections from the original PRD remain fully applicable and should be referenced:
>
> - **Visual / Block Coding Interface** (Blockly + react-blockly integration, custom M5Stick blocks, MicroPython code generation)
> - **Next.js Application Architecture** (RSC patterns, client islands, streaming, Server Actions)
> - **Clerk Authentication** (parent + kid account model, Organizations, PIN login)
> - **Supabase Backend** (PostgreSQL, RLS policies, real-time subscriptions)
> - **Web Serial API & Web Terminal** (device connection, REPL protocol, firmware flash)
> - **End-to-End Runtime Architecture** (code compilation, flash flow, simulator)
> - **Development Environment & Package Versions**
> - **Device Update & Flashing via Web** (esptool-js comprehensive guide)
>
> These sections should be updated to use "TinkerSchool" branding but the technical implementation details are unchanged.

---

*This PRD is a living document. As TinkerSchool evolves from MVP to platform, this document will be updated to reflect new decisions, user feedback, and community contributions.*

*Built with care for Cassidy and every kid who deserves a personalized, hands-on, joyful education.*
