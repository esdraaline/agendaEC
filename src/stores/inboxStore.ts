import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { InboxEntry } from '@/types/inbox'

interface InboxState {
  entries: InboxEntry[]
  addEntry: (text: string) => void
  markProcessed: (id: string) => void
}

export const useInboxStore = create<InboxState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (text) =>
        set((state) => {
          const entry = {
            id: crypto.randomUUID(),
            raw_text: text,
            created_at: new Date().toISOString(),
            processed: false,
          }
          console.debug('[Inbox] Entry created', entry)
          return {
            entries: [entry, ...state.entries],
          }
        }),
      markProcessed: (id) =>
        set((state) => {
          console.debug('[Inbox] Marking processed', id)
          return {
            entries: state.entries.map((e) =>
              e.id === id ? { ...e, processed: true } : e
            ),
          }
        }),
    }),
    {
      name: 'agendaec-inbox',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
