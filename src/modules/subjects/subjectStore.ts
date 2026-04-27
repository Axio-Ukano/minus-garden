import { create } from "zustand";
import { tauriInvoke } from "@/lib/tauri";

export interface Subject {
  id: string;
  name: string;
  color: string;
  useCount: number;
}

interface SubjectState {
  subjects: Subject[];
  isLoaded: boolean;
  loadSubjects: () => Promise<void>;
  addSubject: (name: string, color?: string) => Promise<void>;
  markUsed: (id: string) => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  isLoaded: false,

  loadSubjects: async () => {
    try {
      const raw = await tauriInvoke<{ id: string; name: string; color: string; use_count: number }[]>(
        "get_subjects"
      );
      const subjects: Subject[] = raw.map((s) => ({
        id: s.id,
        name: s.name,
        color: s.color,
        useCount: s.use_count,
      }));
      set({ subjects, isLoaded: true });
    } catch {
      // Toast already surfaced; leave subjects empty.
    }
  },

  addSubject: async (name: string, color = "#e8a0b4") => {
    await tauriInvoke("save_subject", { name, color });
    await get().loadSubjects();
  },

  markUsed: (id: string) => {
    // Fire-and-forget; tauriInvoke handles toast/log on failure.
    tauriInvoke("update_subject_usage", { id }).catch(() => {});
  },
}));
