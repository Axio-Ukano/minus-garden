import { create } from "zustand";
import { tauriInvoke, TauriError } from "@/lib/tauri";

export interface Session {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  subject: string;
  completed: boolean;
  hearts_earned: number;
  plant_species: string;
  plant_stage: number;
}

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
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  sessions: [],
  totalHearts: 0,
  loading: false,
  error: null,

  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await tauriInvoke<Session[]>("get_sessions");
      set({ sessions, loading: false });
    } catch (e) {
      set({ error: e instanceof TauriError ? e.raw : String(e), loading: false });
    }
  },

  loadUserState: async () => {
    try {
      const result = await tauriInvoke<{ total_hearts: number }>("get_user_state");
      set({ totalHearts: result.total_hearts });
    } catch (e) {
      // Toast already surfaced by tauriInvoke; keep totalHearts at last known value.
      // Log for developer diagnostics — kept minimal so production console stays clean.
      console.error("[historyStore.loadUserState]", e);
    }
  },

  saveSession: async (session: Session) => {
    await tauriInvoke("save_session", { session });
    await get().loadSessions();
  },

  deleteSession: async (id: string) => {
    await tauriInvoke("delete_session", { id });
    await get().loadSessions();
  },

  syncHearts: async (total: number) => {
    await tauriInvoke("update_hearts", { totalHearts: total });
    set({ totalHearts: total });
  },
}));
