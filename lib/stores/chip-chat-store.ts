import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChipChatState {
  /** Whether the user has manually dismissed the Chip chat panel */
  hasDismissedChat: boolean;
  /** Mark that the user closed the chat (persists across sessions) */
  dismissChat: () => void;
  /** Reset so auto-open can fire again (e.g. after a long absence) */
  resetDismissed: () => void;
}

export const useChipChatStore = create<ChipChatState>()(
  persist(
    (set) => ({
      hasDismissedChat: false,
      dismissChat: () => set({ hasDismissedChat: true }),
      resetDismissed: () => set({ hasDismissedChat: false }),
    }),
    {
      name: "chip-chat-dismissed",
    },
  ),
);
