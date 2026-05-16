import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PendingMutation } from '@/types/sync'

interface QueueState {
  mutations: PendingMutation[]
  enqueue: (mutation: Omit<PendingMutation, 'id' | 'createdAt' | 'synced'>) => void
  markSynced: (id: string) => void
  clearSynced: () => void
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set) => ({
      mutations: [],
      enqueue: (mutation) =>
        set((state) => {
          const newMutation: PendingMutation = {
            ...mutation,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            synced: false,
          }
          console.debug('[Queue] Mutation enqueued', newMutation)
          return {
            mutations: [...state.mutations, newMutation],
          }
        }),
      markSynced: (id) =>
        set((state) => ({
          mutations: state.mutations.map((m) =>
            m.id === id ? { ...m, synced: true } : m
          ),
        })),
      clearSynced: () =>
        set((state) => ({
          mutations: state.mutations.filter((m) => !m.synced),
        })),
    }),
    {
      name: 'agendaec-queue',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
