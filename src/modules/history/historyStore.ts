// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { create } from "zustand";
import { repository, type Session } from "@/lib/data";
import { TauriError } from "@/lib/tauri";

export type { Session };

interface HistoryState {
  sessions: Session[];
  totalHearts: number;
  loading: boolean;
  error: string | null;
  loadSessions: () => Promise<void>;
  loadUserState: () => Promise<void>;
  saveSession: (session: Session) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  syncHearts: (total: number) => Promise<void>;
  addHearts: (delta: number) => Promise<void>;
  applyHeartsBalance: (total: number) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  sessions: [],
  totalHearts: 0,
  loading: false,
  error: null,

  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await repository.sessions.list();
      set({ sessions, loading: false });
    } catch (e) {
      set({ error: e instanceof TauriError ? e.raw : String(e), loading: false });
    }
  },

  loadUserState: async () => {
    try {
      const { totalHearts } = await repository.userState.get();
      set({ totalHearts });
    } catch (e) {
      // Toast already surfaced by the repository transport; keep totalHearts at
      // its last known value. Log for developer diagnostics — kept minimal so
      // production console stays clean.
      console.error("[historyStore.loadUserState]", e);
    }
  },

  saveSession: async (session: Session) => {
    await repository.sessions.save(session);
    await get().loadSessions();
  },

  deleteSession: async (id: string) => {
    await repository.sessions.remove(id);
    await get().loadSessions();
  },

  syncHearts: async (total: number) => {
    await repository.userState.setHearts(total);
    set({ totalHearts: total });
  },

  addHearts: async (delta: number) => {
    // Re-read the persisted total before writing so a stale or failed startup
    // load can't overwrite the stored hearts with a lower value.
    let base = get().totalHearts;
    try {
      base = (await repository.userState.get()).totalHearts;
    } catch {
      // Toast already surfaced by the transport; fall back to in-memory total.
    }
    const total = base + delta;
    await repository.userState.setHearts(total);
    set({ totalHearts: total });
  },

  // Adopt a balance the backend has already persisted (e.g. the total returned
  // by an atomic shop purchase). No write-back: the backend is ahead of us.
  applyHeartsBalance: (total: number) => {
    set({ totalHearts: total });
  },
}));
