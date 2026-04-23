import { create } from "zustand";
import { useHistoryStore } from "../history/historyStore";
import type { Session } from "../history/historyStore";
import { calculateFinalStage, getSpeciesById } from "../plants/plantService";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

interface TimerState {
  durationMinutes: number;
  secondsLeft: number;
  status: TimerStatus;
  subject: string;
  startedAt: string | null;
  plantSpeciesId: string;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => void;
  tick: () => void;
  setDuration: (minutes: number) => void;
  setSubject: (subject: string) => void;
  setPlantSpecies: (id: string) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  durationMinutes: 25,
  secondsLeft: 25 * 60,
  status: "idle",
  subject: "",
  startedAt: null,
  plantSpeciesId: "daisy",

  start: () =>
    set((s) => ({
      status: "running",
      secondsLeft: s.durationMinutes * 60,
      startedAt: new Date().toISOString(),
    })),

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  reset: () =>
    set((s) => ({
      status: "idle",
      secondsLeft: s.durationMinutes * 60,
      startedAt: null,
    })),

  finish: () => {
    const { durationMinutes, startedAt, subject, plantSpeciesId } = get();
    const species = getSpeciesById(plantSpeciesId);
    const heartsEarned = Math.floor(durationMinutes / 5);
    const plantStage = calculateFinalStage(durationMinutes, species);
    const session: Session = {
      id: crypto.randomUUID(),
      start_time: startedAt ?? new Date().toISOString(),
      end_time: new Date().toISOString(),
      duration_minutes: durationMinutes,
      subject,
      completed: true,
      hearts_earned: heartsEarned,
      plant_species: plantSpeciesId,
      plant_stage: plantStage,
    };
    useHistoryStore.getState().saveSession(session);
    useHistoryStore.getState().syncHearts(useHistoryStore.getState().totalHearts + heartsEarned);
    set({ status: "finished", secondsLeft: 0, startedAt: null });
  },

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

  setPlantSpecies: (id: string) => set({ plantSpeciesId: id }),
}));
