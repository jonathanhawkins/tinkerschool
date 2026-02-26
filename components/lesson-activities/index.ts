// Barrel exports for lesson activity components
export { MultipleChoice } from "./multiple-choice";
export { CountingWidget } from "./counting-widget";
export { MatchingPairs } from "./matching-pairs";
export { SequenceOrder } from "./sequence-order";
export { FlashCard } from "./flash-card";
export { FillInBlank } from "./fill-in-blank";
export { NumberBond } from "./number-bond";
export { TenFrame } from "./ten-frame";
export { NumberLine } from "./number-line";
export { Rekenrek } from "./rekenrek";
export { ParentActivity } from "./parent-activity";
export { EmotionPicker } from "./emotion-picker";
export { DragToSort } from "./drag-to-sort";
export { ListenAndFind } from "./listen-and-find";
export { TapAndReveal } from "./tap-and-reveal";
export { TraceShape } from "./trace-shape";
export { ActivityFeedback } from "./activity-feedback";
export { ActivityProgress } from "./activity-progress";
export { ActivityComplete } from "./activity-complete";
export { SoundToggle } from "./sound-toggle";

// Audio narration for Pre-K activities
export { AudioReplayButton } from "@/components/audio-replay-button";

// Re-export hooks used by activity widgets
export { useAudioNarration } from "@/hooks/use-audio-narration";
export { usePreKMode } from "@/hooks/use-pre-k-mode";
