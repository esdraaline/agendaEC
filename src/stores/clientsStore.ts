import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Client } from '@/types/client'
import { useQueueStore } from './queueStore'

interface ClientsState {
  clients: Client[]
  addClient: (client: Client) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  removeClient: (id: string) => void
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) => {
        set((state) => ({
          clients: [client, ...state.clients],
        }))

        console.debug('[Clients] Client added', client)

        useQueueStore.getState().enqueue({
          type: 'client_create',
          entityId: client.id,
          payload: client,
        })
      },
      updateClient: (id, updates) => {
        let updatedClient: Client | undefined

        set((state) => {
          const newClients = state.clients.map((c) => {
            if (c.id !== id) return c

            updatedClient = {
              ...c,
              ...updates,
              updated_at: new Date().toISOString(),
            }

            return updatedClient
          })

          return {
            clients: newClients,
          }
        })

        console.debug('[Clients] Client updated', id)

        if (updatedClient) {
          useQueueStore.getState().enqueue({
            type: 'client_update',
            entityId: id,
            payload: updatedClient,
          })
        }
      },
      removeClient: (id) => {
        set((state) => {
          const newClients = state.clients.map((c) =>
            c.id === id ? { ...c, deleted_at: new Date().toISOString() } : c
          )
          return { clients: newClients }
        })

        console.debug('[Clients] Client soft removed', id)

        useQueueStore.getState().enqueue({
          type: 'client_delete',
          entityId: id,
          payload: { deleted_at: new Date().toISOString() },
        })
      },
    }),
    {
      name: 'agendaec-clients',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
