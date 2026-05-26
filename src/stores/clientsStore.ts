import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Client } from '@/types/client'
import { useQueueStore } from './queueStore'
import { supabase } from '@/lib/supabase'

interface ClientsState {
  clients: Client[]
  addClient: (client: Client) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  removeClient: (id: string) => void
  fetchFromRemote: (storeId: string) => Promise<void>
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
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
      fetchFromRemote: async (storeId: string) => {
        if (get().clients.length > 0) return

        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('store_id', storeId)
          .is('deleted_at', null)
        
        if (error) {
          console.error('[Sync] Erro ao buscar clients:', error)
          return
        }

        if (data && data.length > 0) {
          set({ clients: data as Client[] })
          console.debug('[Sync] clients recuperados do Supabase:', data.length)
        }
      }
    }),
    {
      name: 'agendaec-clients',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
