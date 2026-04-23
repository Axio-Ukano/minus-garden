import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'

export interface Subject {
  id: string
  name: string
  color: string
  useCount: number
}

interface SubjectState {
  subjects: Subject[]
  isLoaded: boolean
  loadSubjects: () => Promise<void>
  addSubject: (name: string, color?: string) => Promise<void>
  markUsed: (id: string) => void
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  isLoaded: false,

  loadSubjects: async () => {
    const raw = await invoke<{ id: string; name: string; color: string; use_count: number }[]>('get_subjects')
    const subjects: Subject[] = raw.map(s => ({
      id: s.id,
      name: s.name,
      color: s.color,
      useCount: s.use_count,
    }))
    set({ subjects, isLoaded: true })
  },

  addSubject: async (name: string, color = '#e8a0b4') => {
    await invoke('save_subject', { name, color })
    await get().loadSubjects()
  },

  markUsed: (id: string) => {
    invoke('update_subject_usage', { id }).catch(() => {})
  },
}))
