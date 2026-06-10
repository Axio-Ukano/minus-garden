// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { create } from "zustand";
import { repository, type Subject } from "@/lib/data";

export type { Subject };

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
      const subjects = await repository.subjects.list();
      set({ subjects, isLoaded: true });
    } catch {
      // Toast already surfaced; leave subjects empty.
    }
  },

  addSubject: async (name: string, color = "#e8a0b4") => {
    await repository.subjects.create(name, color);
    await get().loadSubjects();
  },

  markUsed: (id: string) => {
    // Fire-and-forget; the repository transport handles toast/log on failure.
    repository.subjects.markUsed(id).catch(() => {});
  },
}));
