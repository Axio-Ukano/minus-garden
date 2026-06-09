import { create } from "zustand";
import { useHistoryStore, type Session } from "@/modules/history";
import { calculateFinalStage, calculateHeartsEarned, getSpeciesById } from "@/modules/plants";
import { audioService } from "@/modules/audio";
import { useSettingsStore } from "@/modules/settings";

function sfxVols() {
  const s = useSettingsStore.getState();
  return { master: s.masterVolume, sfx: s.sfxVolume };
}

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

  start: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_start", master, sfx);
    set((s) => ({
      status: "running",
      secondsLeft: s.durationMinutes * 60,
      startedAt: new Date().toISOString(),
    }));
  },

  pause: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_pause", master, sfx);
    set({ status: "paused" });
  },

  resume: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_start", master, sfx);
    set({ status: "running" });
  },

  reset: () =>
    set((s) => ({
      status: "idle",
      secondsLeft: s.durationMinutes * 60,
      startedAt: null,
    })),

  finish: () => {
    const { durationMinutes, startedAt, subject, plantSpeciesId } = get();
    const species = getSpeciesById(plantSpeciesId);
    const heartsEarned = calculateHeartsEarned(durationMinutes);
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
    void useHistoryStore.getState().saveSession(session);
    void useHistoryStore
      .getState()
      .syncHearts(useHistoryStore.getState().totalHearts + heartsEarned);
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_finish", master, sfx);
    setTimeout(() => audioService.playSfx("session_saved", master, sfx), 800);
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
