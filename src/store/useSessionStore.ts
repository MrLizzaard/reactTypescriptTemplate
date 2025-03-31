import { create } from "zustand";

interface SessionStore {
  sessionExpired: boolean;
  expireReason: string;
  setSessionExpired: (reason: string) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessionExpired: false,
  expireReason: "",
  setSessionExpired: (reason: string) => set({ sessionExpired: true, expireReason: reason }),
  resetSession: () => set({ sessionExpired: false, expireReason: "" }),
}));