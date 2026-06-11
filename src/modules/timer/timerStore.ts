// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { create } from "zustand";
import { useHistoryStore, type Session } from "@/modules/history";
import { calculateFinalStage, calculateHeartsEarned, getSpeciesById } from "@/modules/plants";
import { audioService } from "@/modules/audio";
import { useSettingsStore } from "@/modules/settings";

function sfxVols() {
  const s = useSettingsStore.getState();
  return {
    master: s.masterMuted ? 0 : s.masterVolume,
    sfx: s.sfxMuted ? 0 : s.sfxVolume,
  };
}

function remainingSeconds(endAt: number): number {
  return Math.max(0, Math.round((endAt - Date.now()) / 1000));
}

export type TimerStatus = "idle" | "running" | "paused" | "finished";

interface TimerState {
  durationMinutes: number;
  secondsLeft: number;
  status: TimerStatus;
  subject: string;
  startedAt: string | null;
  /** Wall-clock deadline (epoch ms) while running; null when idle/paused/finished. */
  endAt: number | null;
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
  endAt: null,
  plantSpeciesId: "daisy",

  start: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_start", master, sfx);
    set((s) => ({
      status: "running",
      secondsLeft: s.durationMinutes * 60,
      startedAt: new Date().toISOString(),
      endAt: Date.now() + s.durationMinutes * 60 * 1000,
    }));
  },

  pause: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_pause", master, sfx);
    set((s) => ({
      status: "paused",
      secondsLeft: s.endAt !== null ? remainingSeconds(s.endAt) : s.secondsLeft,
      endAt: null,
    }));
  },

  resume: () => {
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_start", master, sfx);
    set((s) => ({ status: "running", endAt: Date.now() + s.secondsLeft * 1000 }));
  },

  reset: () =>
    set((s) => ({
      status: "idle",
      secondsLeft: s.durationMinutes * 60,
      startedAt: null,
      endAt: null,
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
    // Fire-and-forget; the repository transport handles toast/log on failure.
    useHistoryStore
      .getState()
      .saveSession(session)
      .catch(() => {});
    useHistoryStore
      .getState()
      .addHearts(heartsEarned)
      .catch(() => {});
    const { master, sfx } = sfxVols();
    audioService.playSfx("timer_finish", master, sfx);
    setTimeout(() => audioService.playSfx("session_saved", master, sfx), 800);
    set({ status: "finished", secondsLeft: 0, startedAt: null, endAt: null });
  },

  tick: () => {
    const { endAt, secondsLeft, finish } = get();
    // Anchor to the wall-clock deadline when available: webview timers are
    // throttled while the window is hidden, so counting interval firings
    // would stretch the session.
    const remaining = endAt !== null ? remainingSeconds(endAt) : secondsLeft - 1;
    if (remaining <= 0) {
      finish();
    } else {
      set({ secondsLeft: remaining });
    }
  },

  setDuration: (minutes: number) =>
    set({ durationMinutes: minutes, secondsLeft: minutes * 60, status: "idle", endAt: null }),

  setSubject: (subject: string) => set({ subject }),

  setPlantSpecies: (id: string) => set({ plantSpeciesId: id }),
}));
