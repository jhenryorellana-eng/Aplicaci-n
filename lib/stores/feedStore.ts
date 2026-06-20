import { create } from "zustand";

interface FeedState {
  /** Índice del slide actualmente visible (el que reproduce). */
  activeIndex: number;
  /** El feed arranca muteado (requisito de autoplay en móvil). */
  muted: boolean;
  setActiveIndex: (index: number) => void;
  toggleMuted: () => void;
  setMuted: (value: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  activeIndex: 0,
  muted: true,
  setActiveIndex: (index) => set({ activeIndex: index }),
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
  setMuted: (value) => set({ muted: value }),
}));
