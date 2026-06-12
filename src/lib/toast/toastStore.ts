// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { create } from "zustand";

export type ToastKind = "info" | "error" | "success";

export interface ToastEntry {
  id: number;
  message: string;
  kind: ToastKind;
  // Bumped when an identical toast is re-pushed so the item restarts its
  // countdown instead of stacking a duplicate.
  seq: number;
}

interface ToastState {
  toasts: ToastEntry[];
  pushToast: (message: string, kind?: ToastKind) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  pushToast: (message, kind = "info") => {
    const existing = get().toasts.find((t) => t.message === message && t.kind === kind);
    if (existing) {
      set((s) => ({
        toasts: s.toasts.map((t) => (t.id === existing.id ? { ...t, seq: t.seq + 1 } : t)),
      }));
      return existing.id;
    }
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, kind, seq: 0 }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function pushToast(message: string, kind: ToastKind = "info"): number {
  return useToastStore.getState().pushToast(message, kind);
}
