import { create } from "zustand";

interface LoadingState {
  loadingCount: number;
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingCount: 0,
  showLoading: () => set({ loadingCount: get().loadingCount + 1 }),
  hideLoading: () => {
    const newCount = Math.max(0, get().loadingCount - 1);
    set({ loadingCount: newCount });
  },
  get isLoading() {
    return get().loadingCount > 0;
  },
}));
