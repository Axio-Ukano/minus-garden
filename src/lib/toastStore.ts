import { create } from "zustand";

export type ToastKind = "info" | "error" | "success";

export interface ToastEntry {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: ToastEntry[];
  pushToast: (message: string, kind?: ToastKind) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (message, kind = "info") => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, kind }] }));
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function pushToast(message: string, kind: ToastKind = "info"): void {
  useToastStore.getState().pushToast(message, kind);
}
