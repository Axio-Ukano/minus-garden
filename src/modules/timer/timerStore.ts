import { create } from "zustand";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

interface TimerState {
  durationMinutes: number;
  secondsLeft: number;
  status: TimerStatus;
  subject: string;
  hearts: number;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => void;
  tick: () => void;
  setDuration: (minutes: number) => void;
  setSubject: (subject: string) => void;
  addHearts: (count: number) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  durationMinutes: 25,
  secondsLeft: 25 * 60,
  status: "idle",
  subject: "",
  hearts: 0,

  start: () =>
    set((s) => ({
      status: "running",
      secondsLeft: s.durationMinutes * 60,
    })),

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  reset: () =>
    set((s) => ({
      status: "idle",
      secondsLeft: s.durationMinutes * 60,
    })),

  finish: () => set({ status: "finished", secondsLeft: 0 }),

  tick: () => {
    const { secondsLeft, finish } = get();
    if (secondsLeft <= 1) {
      finish();
    } else {
      set((s) => ({ secondsLeft: s.secondsLeft - 1 }));
    }
  },

  setDuration: (minutes: number) =>
    set({ durationMinutes: minutes, secondsLeft: minutes * 60, status: "idle" }),

  setSubject: (subject: string) => set({ subject }),

  addHearts: (count: number) => set((s) => ({ hearts: s.hearts + count })),
}));
