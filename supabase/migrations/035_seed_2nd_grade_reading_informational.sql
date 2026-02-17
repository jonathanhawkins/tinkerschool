-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Reading Module: Informational Text
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Informational Text module (main idea, details, text features, author's
--     purpose, connecting ideas)
--
-- Reuses existing skills from 018:
--   Main Idea & Details:                20000002-0006-4000-8000-000000000001
-- Adds new skill:
--   Reading Comprehension (Informational): 20000002-0008-4000-8000-000000000001
--   (NOTE: 20000002-0007 is already used for Punctuation in 018)
--
-- Widget types used: multiple_choice, fill_in_blank, matching_pairs,
--   sequence_order
--
-- Subject ID:
--   Reading (2nd grade): f04d2171-6b54-41bf-900d-d3d082ba65ed
--
-- Module ID:
--   Informational Text:  10000002-0206-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql, 018_seed_2nd_grade_reading_science.sql
-- =============================================================================


-- =========================================================================
-- 1. SKILL -- Reading Comprehension (Informational)
-- =========================================================================
-- Main Idea & Details (20000002-0006) already exists from 018.
-- We add Reading Comprehension (Informational) as a new skill.
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000002-0008-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'reading_comp_info', 'Reading Comprehension (Informational)', 'Ask and answer questions about key details in an informational text', 'RI.2.1', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE -- Informational Text (Band 2 Reading)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0206-4000-8000-000000000001', 2, 25, 'Informational Text', 'Become a nonfiction expert! Find main ideas, spot text features, and discover what authors are trying to tell us!', 'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed')
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Main Idea Detective
-- Module: Informational Text | Skill: Main Idea & Details
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0010-4000-8000-000000000001',
  '10000002-0206-4000-8000-000000000001',
  1,
  'Main Idea Detective',
  'Read short passages and find the MAIN idea hiding inside!',
  'Put on your detective hat! Chip has a magnifying glass and we''re hunting for MAIN IDEAS! Every nonfiction paragraph has ONE big idea that all the other sentences support. The main idea is like the title of a chapter -- it tells you what the whole thing is about. Let''s investigate!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mid-1",
            "prompt": "\ud83d\udd0d \"Dolphins are amazing swimmers. They can jump high out of the water. Dolphins use clicks and whistles to talk to each other. They live together in groups called pods.\" What is the MAIN idea?",
            "options": [
              {"id": "a", "text": "Dolphins are amazing swimmers", "emoji": "\ud83d\udc2c"},
              {"id": "b", "text": "Dolphins jump out of the water", "emoji": ""},
              {"id": "c", "text": "Dolphins live in pods", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The main idea is the BIG message. All the other sentences tell us cool things about dolphins. Which sentence covers them ALL?"
          },
          {
            "id": "mid-2",
            "prompt": "\ud83d\udd0d \"Bees are very important insects. They help flowers grow by carrying pollen. Bees also make honey. Without bees, many plants would not have fruit.\" What is the MAIN idea?",
            "options": [
              {"id": "a", "text": "Bees make honey", "emoji": ""},
              {"id": "b", "text": "Bees are very important insects", "emoji": "\ud83d\udc1d"},
              {"id": "c", "text": "Bees carry pollen", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Which sentence is the BIGGEST idea? The other sentences explain WHY bees are important."
          },
          {
            "id": "mid-3",
            "prompt": "\ud83d\udd0d \"Penguins are birds that cannot fly. They are great swimmers instead. Penguins use their flippers to glide through cold ocean water. They catch fish to eat.\" What is the MAIN idea?",
            "options": [
              {"id": "a", "text": "Penguins catch fish", "emoji": ""},
              {"id": "b", "text": "Penguins have flippers", "emoji": ""},
              {"id": "c", "text": "Penguins are birds that cannot fly", "emoji": "\ud83d\udc27"}
            ],
            "correctOptionId": "c",
            "hint": "The first sentence introduces the BIG topic. Everything else gives details about what penguins do instead of flying."
          },
          {
            "id": "mid-4",
            "prompt": "\ud83d\udd0d \"Elephants are the largest land animals. They can weigh as much as a school bus! Elephants use their long trunks to drink water and grab food. Baby elephants stay close to their mothers.\" Which sentence is a DETAIL, not the main idea?",
            "options": [
              {"id": "a", "text": "Elephants are the largest land animals", "emoji": ""},
              {"id": "b", "text": "Baby elephants stay close to their mothers", "emoji": "\ud83d\udc18"},
              {"id": "c", "text": "All of these are the main idea", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A detail is a smaller fact that supports the big idea. Which one is just ONE thing about elephants?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "mid-5",
            "prompt": "\ud83d\udd0d The main idea tells us what the whole passage is ___. \ud83d\udcdd",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "about",
                "acceptableAnswers": ["about", "About", "ABOUT"]
              }
            ],
            "hint": "The main idea tells us the BIG topic. It tells us what the passage is... a-b-o-u-t!"
          },
          {
            "id": "mid-6",
            "prompt": "\ud83d\udd0d \"Owls are great hunters. They can see in the dark. Owls fly very quietly. They have sharp claws for catching mice.\" The main idea is: Owls are great ___. \ud83e\udd89",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "hunters",
                "acceptableAnswers": ["hunters", "Hunters", "HUNTERS"]
              }
            ],
            "hint": "All the details tell us about how owls catch food. They are great... h-u-n-t-e-r-s!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Supporting Details
-- Module: Informational Text | Skill: Main Idea & Details
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0011-4000-8000-000000000001',
  '10000002-0206-4000-8000-000000000001',
  2,
  'Supporting Details',
  'Match details to the main idea they support -- like branches on a tree!',
  'Chip is building a DETAIL TREE! The main idea is the trunk -- big and strong. The details are the branches -- they grow OUT of the main idea and tell us more. A good reader knows which details go with which main idea. Let''s match them up!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each DETAIL to the MAIN IDEA it supports! \ud83c\udf33",
        "pairs": [
          {
            "id": "sd-1",
            "left": {"id": "d1", "text": "They have soft fur to keep warm", "emoji": "\ud83d\udc3e"},
            "right": {"id": "m1", "text": "Cats are good pets", "emoji": "\ud83d\udc31"}
          },
          {
            "id": "sd-2",
            "left": {"id": "d2", "text": "They grow from seeds in the ground", "emoji": "\ud83c\udf31"},
            "right": {"id": "m2", "text": "Plants are living things", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "sd-3",
            "left": {"id": "d3", "text": "They come in many colors like red and yellow", "emoji": "\ud83c\udf4e"},
            "right": {"id": "m3", "text": "Apples are interesting fruits", "emoji": "\ud83c\udf4f"}
          },
          {
            "id": "sd-4",
            "left": {"id": "d4", "text": "They can learn to fetch and sit", "emoji": "\ud83e\uddbe"},
            "right": {"id": "m4", "text": "Dogs can learn tricks", "emoji": "\ud83d\udc36"}
          },
          {
            "id": "sd-5",
            "left": {"id": "d5", "text": "They need water and sunlight", "emoji": "\u2600\ufe0f"},
            "right": {"id": "m5", "text": "Plants are living things", "emoji": "\ud83c\udf3f"}
          }
        ],
        "hint": "A supporting detail tells us MORE about the main idea. Ask yourself: does this fact help explain the big idea?"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sd-mc-1",
            "prompt": "\ud83c\udf33 Main idea: \"Frogs are amazing jumpers.\" Which detail SUPPORTS this main idea?",
            "options": [
              {"id": "a", "text": "Frogs can leap 20 times their body length", "emoji": "\ud83d\udc38"},
              {"id": "b", "text": "Frogs are green", "emoji": ""},
              {"id": "c", "text": "Frogs live near ponds", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Which detail tells us MORE about frogs being amazing jumpers? Look for the one about jumping!"
          },
          {
            "id": "sd-mc-2",
            "prompt": "\ud83c\udf33 Main idea: \"Winter is a cold season.\" Which detail does NOT support this idea?",
            "options": [
              {"id": "a", "text": "Snow falls from the sky", "emoji": "\u2744\ufe0f"},
              {"id": "b", "text": "People wear warm coats", "emoji": "\ud83e\udde5"},
              {"id": "c", "text": "Ice cream comes in many flavors", "emoji": "\ud83c\udf66"}
            ],
            "correctOptionId": "c",
            "hint": "Two of these tell us about cold weather. Which one is about something totally different?"
          },
          {
            "id": "sd-mc-3",
            "prompt": "\ud83c\udf33 Main idea: \"The ocean is full of life.\" Which is a supporting detail?",
            "options": [
              {"id": "a", "text": "The ocean is made of salt water", "emoji": ""},
              {"id": "b", "text": "Colorful fish swim near coral reefs", "emoji": "\ud83d\udc20"},
              {"id": "c", "text": "Ships sail across the ocean", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "We need a detail about LIFE in the ocean. Which one talks about living creatures?"
          },
          {
            "id": "sd-mc-4",
            "prompt": "\ud83c\udf33 Main idea: \"Exercise keeps your body healthy.\" Which detail supports this?",
            "options": [
              {"id": "a", "text": "Running makes your heart stronger", "emoji": "\ud83c\udfc3"},
              {"id": "b", "text": "Pizza is a popular food", "emoji": ""},
              {"id": "c", "text": "Shoes come in many sizes", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Which detail tells us HOW exercise helps your body?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Text Features Treasure Hunt
-- Module: Informational Text | Skill: Reading Comprehension (Informational)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0012-4000-8000-000000000001',
  '10000002-0206-4000-8000-000000000001',
  3,
  'Text Features Treasure Hunt',
  'Discover how headings, bold words, captions, and glossaries help you read nonfiction!',
  'Chip is exploring a nonfiction book like a treasure map! Headings are like street signs -- they tell you what''s coming next. Bold words are clues -- they show important vocabulary. Captions explain pictures. And a glossary at the back is like a mini dictionary! Let''s go on a treasure hunt!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each text feature to what it DOES! \ud83d\uddfa\ufe0f",
        "pairs": [
          {
            "id": "tf-1",
            "left": {"id": "heading", "text": "Heading", "emoji": "\ud83d\udccc"},
            "right": {"id": "heading-job", "text": "Tells you what a section is about", "emoji": "\ud83d\udea9"}
          },
          {
            "id": "tf-2",
            "left": {"id": "bold", "text": "Bold Words", "emoji": "\ud83d\udcaa"},
            "right": {"id": "bold-job", "text": "Shows important vocabulary", "emoji": "\u2b50"}
          },
          {
            "id": "tf-3",
            "left": {"id": "caption", "text": "Caption", "emoji": "\ud83d\uddbc\ufe0f"},
            "right": {"id": "caption-job", "text": "Explains a picture or photo", "emoji": "\ud83d\udcf7"}
          },
          {
            "id": "tf-4",
            "left": {"id": "glossary", "text": "Glossary", "emoji": "\ud83d\udcd6"},
            "right": {"id": "glossary-job", "text": "A mini dictionary at the back of a book", "emoji": "\ud83d\udd0d"}
          },
          {
            "id": "tf-5",
            "left": {"id": "table-of-contents", "text": "Table of Contents", "emoji": "\ud83d\udcdd"},
            "right": {"id": "toc-job", "text": "Lists chapters and page numbers", "emoji": "\ud83d\udcd1"}
          }
        ],
        "hint": "Think about where you find each feature in a book. Headings are at the top of sections. The glossary is at the back!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tf-mc-1",
            "prompt": "\ud83d\uddfa\ufe0f You see the word \"hibernate\" in BOLD in a book about bears. Why is it bold?",
            "options": [
              {"id": "a", "text": "It looks pretty", "emoji": ""},
              {"id": "b", "text": "It is an important word to learn", "emoji": "\u2b50"},
              {"id": "c", "text": "It is the title of the book", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Authors make words BOLD when they are important vocabulary words you should pay attention to!"
          },
          {
            "id": "tf-mc-2",
            "prompt": "\ud83d\uddfa\ufe0f You see a photo of a rainforest with words underneath it. Those words are called a ___.",
            "options": [
              {"id": "a", "text": "Heading", "emoji": ""},
              {"id": "b", "text": "Glossary", "emoji": ""},
              {"id": "c", "text": "Caption", "emoji": "\ud83d\udcf7"}
            ],
            "correctOptionId": "c",
            "hint": "The words below a photo explain what the picture shows. That''s called a..."
          },
          {
            "id": "tf-mc-3",
            "prompt": "\ud83d\uddfa\ufe0f Where would you look to find the meaning of a tricky word in a nonfiction book?",
            "options": [
              {"id": "a", "text": "The table of contents", "emoji": ""},
              {"id": "b", "text": "The glossary", "emoji": "\ud83d\udcd6"},
              {"id": "c", "text": "The heading", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "It''s like a mini dictionary at the back of the book. It starts with G!"
          },
          {
            "id": "tf-mc-4",
            "prompt": "\ud83d\uddfa\ufe0f A book about animals has these headings: \"Mammals,\" \"Reptiles,\" \"Birds.\" What do the headings help you do?",
            "options": [
              {"id": "a", "text": "Find the section you want to read", "emoji": "\ud83c\udfaf"},
              {"id": "b", "text": "Count the pages", "emoji": ""},
              {"id": "c", "text": "See the pictures", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Headings are like signs on a road. They help you find where you want to go in the book!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Author's Purpose
-- Module: Informational Text | Skill: Reading Comprehension (Informational)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0013-4000-8000-000000000001',
  '10000002-0206-4000-8000-000000000001',
  4,
  'Author''s Purpose',
  'Figure out WHY the author wrote it: to inform, entertain, or persuade!',
  'Chip is wondering: WHY did the author write this? Every author has a PURPOSE! Some authors want to INFORM you -- teach you something new. Some want to ENTERTAIN you -- make you laugh or enjoy a story. And some want to PERSUADE you -- convince you to think or do something. Let''s figure out which is which!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ap-1",
            "prompt": "\ud83e\udd14 \"The sun is a star. It gives Earth light and heat. Without the sun, nothing could live on Earth.\" Why did the author write this?",
            "options": [
              {"id": "a", "text": "To inform (teach you facts)", "emoji": "\ud83d\udcda"},
              {"id": "b", "text": "To entertain (make you laugh)", "emoji": "\ud83d\ude02"},
              {"id": "c", "text": "To persuade (convince you)", "emoji": "\ud83d\udce2"}
            ],
            "correctOptionId": "a",
            "hint": "Is this passage trying to teach you something? It gives facts about the sun -- that sounds like informing!"
          },
          {
            "id": "ap-2",
            "prompt": "\ud83e\udd14 \"Once upon a time, a silly frog tried to sing like a bird. He croaked so loudly that all the fish laughed!\" Why did the author write this?",
            "options": [
              {"id": "a", "text": "To inform (teach you facts)", "emoji": "\ud83d\udcda"},
              {"id": "b", "text": "To entertain (make you laugh)", "emoji": "\ud83d\ude02"},
              {"id": "c", "text": "To persuade (convince you)", "emoji": "\ud83d\udce2"}
            ],
            "correctOptionId": "b",
            "hint": "A silly frog singing? Fish laughing? This sounds like a funny story meant to make you smile!"
          },
          {
            "id": "ap-3",
            "prompt": "\ud83e\udd14 \"Everyone should recycle! Recycling helps keep our planet clean. You can recycle paper, plastic, and glass. Please start recycling today!\" Why did the author write this?",
            "options": [
              {"id": "a", "text": "To inform (teach you facts)", "emoji": "\ud83d\udcda"},
              {"id": "b", "text": "To entertain (make you laugh)", "emoji": "\ud83d\ude02"},
              {"id": "c", "text": "To persuade (convince you to recycle)", "emoji": "\u267b\ufe0f"}
            ],
            "correctOptionId": "c",
            "hint": "The author says \"everyone SHOULD\" and \"PLEASE start.\" They''re trying to convince you to do something!"
          },
          {
            "id": "ap-4",
            "prompt": "\ud83e\udd14 \"Ants live in colonies underground. Each ant has a job. Some ants find food, some protect the nest, and the queen lays eggs.\" Why did the author write this?",
            "options": [
              {"id": "a", "text": "To inform (teach you about ants)", "emoji": "\ud83d\udc1c"},
              {"id": "b", "text": "To entertain (tell a funny ant story)", "emoji": "\ud83d\ude02"},
              {"id": "c", "text": "To persuade (make you like ants)", "emoji": "\ud83d\udce2"}
            ],
            "correctOptionId": "a",
            "hint": "This passage shares facts about how ants live and work. The author wants to teach you!"
          },
          {
            "id": "ap-5",
            "prompt": "\ud83e\udd14 \"You should read every day! Reading makes you smarter and is so much fun. Pick up a book tonight!\" Why did the author write this?",
            "options": [
              {"id": "a", "text": "To inform (teach you facts)", "emoji": "\ud83d\udcda"},
              {"id": "b", "text": "To entertain (make you laugh)", "emoji": "\ud83d\ude02"},
              {"id": "c", "text": "To persuade (convince you to read)", "emoji": "\ud83d\udcd6"}
            ],
            "correctOptionId": "c",
            "hint": "\"You SHOULD\" and \"pick up a book tonight!\" -- the author is trying to convince you to do something!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each passage to the author''s purpose! \ud83c\udfaf",
        "pairs": [
          {
            "id": "ap-p1",
            "left": {"id": "facts", "text": "A book about how volcanoes work", "emoji": "\ud83c\udf0b"},
            "right": {"id": "inform", "text": "Inform (teach facts)", "emoji": "\ud83d\udcda"}
          },
          {
            "id": "ap-p2",
            "left": {"id": "joke", "text": "A joke book for kids", "emoji": "\ud83e\udd23"},
            "right": {"id": "entertain", "text": "Entertain (make you laugh)", "emoji": "\ud83d\ude02"}
          },
          {
            "id": "ap-p3",
            "left": {"id": "ad", "text": "A poster saying \"Vote for class president!\"", "emoji": "\ud83d\uddf3\ufe0f"},
            "right": {"id": "persuade", "text": "Persuade (convince you)", "emoji": "\ud83d\udce2"}
          },
          {
            "id": "ap-p4",
            "left": {"id": "fairy", "text": "A fairy tale about a magic dragon", "emoji": "\ud83d\udc09"},
            "right": {"id": "entertain2", "text": "Entertain (enjoy a story)", "emoji": "\ud83d\ude02"}
          }
        ],
        "hint": "Facts and science = inform. Funny stories = entertain. \"You should\" = persuade!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Connecting Ideas in Text
-- Module: Informational Text | Skills: Main Idea + Reading Comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0014-4000-8000-000000000001',
  '10000002-0206-4000-8000-000000000001',
  5,
  'Connecting Ideas in Text',
  'Put ideas from a passage in order and discover how they connect like puzzle pieces!',
  'Chip loves puzzles, and today we''re putting IDEAS together! In nonfiction, ideas connect to each other like puzzle pieces. One idea leads to the next. Sometimes things happen in order, sometimes one thing CAUSES another, and sometimes ideas are compared. Let''s connect the dots!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0006-4000-8000-000000000001', '20000002-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ci-seq-1",
            "prompt": "\ud83e\udde9 \"How a Bird Builds a Nest\" -- Put these steps in order!",
            "items": [
              {"id": "find", "text": "The bird finds a safe spot in a tree", "emoji": "\ud83c\udf33", "correctPosition": 1},
              {"id": "gather", "text": "It gathers twigs, grass, and leaves", "emoji": "\ud83c\udf3f", "correctPosition": 2},
              {"id": "weave", "text": "It weaves the materials into a bowl shape", "emoji": "\ud83e\ude79", "correctPosition": 3},
              {"id": "line", "text": "It lines the nest with soft feathers", "emoji": "\ud83e\udeb6", "correctPosition": 4},
              {"id": "eggs", "text": "The bird lays eggs in the cozy nest", "emoji": "\ud83e\udd5a", "correctPosition": 5}
            ],
            "hint": "Think about what has to happen FIRST. The bird needs a spot, then materials, then it builds, then makes it comfy, then lays eggs!"
          },
          {
            "id": "ci-seq-2",
            "prompt": "\ud83e\udde9 \"From Seed to Sandwich\" -- How does wheat become bread? Put it in order!",
            "items": [
              {"id": "plant", "text": "A farmer plants wheat seeds", "emoji": "\ud83c\udf31", "correctPosition": 1},
              {"id": "grow", "text": "The wheat grows tall in the field", "emoji": "\ud83c\udf3e", "correctPosition": 2},
              {"id": "harvest", "text": "The farmer harvests the wheat", "emoji": "\ud83d\ude9c", "correctPosition": 3},
              {"id": "flour", "text": "The wheat is ground into flour", "emoji": "\ud83e\udd63", "correctPosition": 4},
              {"id": "bread", "text": "A baker uses the flour to make bread", "emoji": "\ud83c\udf5e", "correctPosition": 5}
            ],
            "hint": "Start with planting! Then the wheat grows, gets harvested, becomes flour, and finally becomes bread!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ci-mc-1",
            "prompt": "\ud83e\udde9 \"Caterpillars eat leaves to grow big. Then they form a chrysalis. Inside, they change into butterflies.\" How are these ideas connected?",
            "options": [
              {"id": "a", "text": "They happen in order (first, then, finally)", "emoji": "\ud83d\udd22"},
              {"id": "b", "text": "They are opposites", "emoji": ""},
              {"id": "c", "text": "They are not connected", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "One thing happens, THEN the next, THEN the next. These ideas follow a time order!"
          },
          {
            "id": "ci-mc-2",
            "prompt": "\ud83e\udde9 \"When it rains a lot, rivers can overflow. This causes flooding in nearby towns.\" How are these ideas connected?",
            "options": [
              {"id": "a", "text": "They are comparing two things", "emoji": ""},
              {"id": "b", "text": "One thing CAUSES the other", "emoji": "\u27a1\ufe0f"},
              {"id": "c", "text": "They are not connected", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Rain causes rivers to overflow, which causes flooding. One event leads to another!"
          },
          {
            "id": "ci-mc-3",
            "prompt": "\ud83e\udde9 \"Frogs live in water and on land. Fish only live in water.\" How are these ideas connected?",
            "options": [
              {"id": "a", "text": "They happen in order", "emoji": ""},
              {"id": "b", "text": "One causes the other", "emoji": ""},
              {"id": "c", "text": "They are comparing two animals", "emoji": "\ud83d\udd00"}
            ],
            "correctOptionId": "c",
            "hint": "The passage talks about frogs AND fish and how they are different. That''s a comparison!"
          },
          {
            "id": "ci-mc-4",
            "prompt": "\ud83e\udde9 \"Bears eat a lot of food in the fall. This helps them survive winter when food is hard to find.\" Why do bears eat so much in fall?",
            "options": [
              {"id": "a", "text": "Because they are bored", "emoji": ""},
              {"id": "b", "text": "Because they need energy to survive winter", "emoji": "\ud83d\udc3b"},
              {"id": "c", "text": "Because fall food tastes better", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The text says eating a lot helps them SURVIVE winter. One idea explains the other!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
