// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AmbientTrackId, ClickSfxId, TypingSfxId } from "@/modules/audio";

export type Theme = "light" | "dark";
export type PlantSide = "left" | "right";
export type Section = "sound" | "interface" | "timer" | "general" | "shortcuts" | "about";
export type Language = "en" | "es";

interface SettingsState {
  theme: Theme;
  plantSide: PlantSide;
  language: Language;
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  musicVolume: number;

  masterMuted: boolean;
  musicMuted: boolean;
  ambientMuted: boolean;
  sfxMuted: boolean;

  // Saved volumes before muting (not persisted)
  _premuteMusic: number;
  _premuteAmbient: number;
  _premuteSfx: number;
  _premuteMaster: number;

  ambientAutoplay: boolean;
  musicAutoplay: boolean;

  // Ambient randomizer
  ambientRandomize: boolean;
  ambientRandomizeMinutes: number;
  ambientRandomizePool: AmbientTrackId[];

  // Custom SFX
  clickSfxId: ClickSfxId;
  typingSfxId: TypingSfxId;

  // Settings modal memory
  lastSettingsSection: Section;

  setTheme: (theme: Theme) => void;
  setPlantSide: (side: PlantSide) => void;
  setLanguage: (language: Language) => void;
  setMasterVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setAmbientVolume: (v: number) => void;
  setMusicVolume: (v: number) => void;
  setMasterMuted: (v: boolean) => void;
  setMusicMuted: (v: boolean) => void;
  setAmbientMuted: (v: boolean) => void;
  setSfxMuted: (v: boolean) => void;
  setAmbientAutoplay: (v: boolean) => void;
  setMusicAutoplay: (v: boolean) => void;
  setAmbientRandomize: (v: boolean) => void;
  setAmbientRandomizeMinutes: (v: number) => void;
  setAmbientRandomizePool: (v: AmbientTrackId[]) => void;
  setClickSfxId: (v: ClickSfxId) => void;
  setTypingSfxId: (v: TypingSfxId) => void;
  setLastSettingsSection: (v: Section) => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      plantSide: "right",
      language: "en",
      masterVolume: 1,
      sfxVolume: 1,
      ambientVolume: 0.5,
      musicVolume: 0.7,
      masterMuted: false,
      musicMuted: false,
      ambientMuted: false,
      sfxMuted: false,
      _premuteMusic: 0.7,
      _premuteAmbient: 0.5,
      _premuteSfx: 1,
      _premuteMaster: 1,
      ambientAutoplay: false,
      musicAutoplay: false,
      ambientRandomize: false,
      ambientRandomizeMinutes: 15,
      ambientRandomizePool: ["rain", "forest", "cafe", "fireplace", "white_noise"],
      clickSfxId: "button_click",
      typingSfxId: "none",
      lastSettingsSection: "sound",

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setPlantSide: (plantSide) => set({ plantSide }),
      setLanguage: (language) => set({ language }),
      setMasterVolume: (masterVolume) => set({ masterVolume }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume }),
      setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
      setMusicVolume: (musicVolume) => set({ musicVolume }),
      setMasterMuted: (masterMuted) =>
        set((s) => ({
          masterMuted,
          _premuteMaster: !masterMuted
            ? s._premuteMaster
            : s.masterVolume > 0
              ? s.masterVolume
              : s._premuteMaster,
          masterVolume: !masterMuted && s.masterVolume === 0 ? s._premuteMaster : s.masterVolume,
        })),
      setMusicMuted: (musicMuted) =>
        set((s) => ({
          musicMuted,
          _premuteMusic: !musicMuted
            ? s._premuteMusic
            : s.musicVolume > 0
              ? s.musicVolume
              : s._premuteMusic,
          musicVolume: !musicMuted && s.musicVolume === 0 ? s._premuteMusic : s.musicVolume,
        })),
      setAmbientMuted: (ambientMuted) =>
        set((s) => ({
          ambientMuted,
          _premuteAmbient: !ambientMuted
            ? s._premuteAmbient
            : s.ambientVolume > 0
              ? s.ambientVolume
              : s._premuteAmbient,
          ambientVolume:
            !ambientMuted && s.ambientVolume === 0 ? s._premuteAmbient : s.ambientVolume,
        })),
      setSfxMuted: (sfxMuted) =>
        set((s) => ({
          sfxMuted,
          _premuteSfx: !sfxMuted ? s._premuteSfx : s.sfxVolume > 0 ? s.sfxVolume : s._premuteSfx,
          sfxVolume: !sfxMuted && s.sfxVolume === 0 ? s._premuteSfx : s.sfxVolume,
        })),
      setAmbientAutoplay: (ambientAutoplay) => set({ ambientAutoplay }),
      setMusicAutoplay: (musicAutoplay) => set({ musicAutoplay }),
      setAmbientRandomize: (ambientRandomize) => set({ ambientRandomize }),
      setAmbientRandomizeMinutes: (ambientRandomizeMinutes) => set({ ambientRandomizeMinutes }),
      setAmbientRandomizePool: (ambientRandomizePool) => set({ ambientRandomizePool }),
      setClickSfxId: (clickSfxId) => set({ clickSfxId }),
      setTypingSfxId: (typingSfxId) => set({ typingSfxId }),
      setLastSettingsSection: (lastSettingsSection) => set({ lastSettingsSection }),
    }),
    {
      name: "minus-garden-settings",
      partialize: (s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _premuteMusic, _premuteAmbient, _premuteSfx, _premuteMaster, ...rest } = s;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);
