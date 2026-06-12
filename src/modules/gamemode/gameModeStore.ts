// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Game-mode store ──────────────────────────────────────────────────────────
// Navigation state for the game-mode layer (shop / garden / minigames) — the
// meta-progression side of the app, distinct from the study tabs. Any module
// can request the layer to open (e.g. the timer deep-links a locked seed to
// the shop); the layer itself renders from this state.

import { create } from "zustand";

export type GameSection = "shop" | "garden" | "minigames";

interface GameModeState {
  isOpen: boolean;
  section: GameSection;
  /** Species whose detail overlay is open in the shop (null = catalog). */
  shopDetailSpeciesId: string | null;
  open: (section?: GameSection) => void;
  close: () => void;
  setSection: (section: GameSection) => void;
  /** Deep link: open the layer on the shop with a species detail in focus. */
  openShopAt: (speciesId: string) => void;
  setShopDetail: (speciesId: string | null) => void;
}

export const useGameModeStore = create<GameModeState>((set, get) => ({
  isOpen: false,
  section: "shop",
  shopDetailSpeciesId: null,

  open: (section) => {
    set({ isOpen: true, section: section ?? get().section });
  },

  close: () => {
    set({ isOpen: false, shopDetailSpeciesId: null });
  },

  setSection: (section) => {
    set({ section });
  },

  openShopAt: (speciesId) => {
    set({ isOpen: true, section: "shop", shopDetailSpeciesId: speciesId });
  },

  setShopDetail: (speciesId) => {
    set({ shopDetailSpeciesId: speciesId });
  },
}));
