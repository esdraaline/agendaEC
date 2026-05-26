import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DailyClosing } from '@/types/dailyClosing'
import { useQueueStore } from './queueStore'
import { supabase } from '@/lib/supabase'

interface DailyClosingsState {
  closings: DailyClosing[]
  addClosing: (closing: DailyClosing) => void
  fetchFromRemote: (storeId: string) => Promise<void>
}

export const useDailyClosingsStore = create<DailyClosingsState>()(
  persist(
    (set, get) => ({
      closings: [],
      addClosing: (closing) => {
        set((state) => ({
          closings: [closing, ...state.closings],
        }))
        useQueueStore.getState().enqueue({
          type: 'daily_closing_create',
          entityId: closing.id,
          payload: closing,
        })
      },
      fetchFromRemote: async (storeId: string) => {
        if (get().closings.length > 0) return

        const { data, error } = await supabase
          .from('daily_closings')
          .select('*')
          .eq('store_id', storeId)
        
        if (error) {
          console.error('[Sync] Erro ao buscar daily_closings:', error)
          return
        }

        if (data && data.length > 0) {
          set({ closings: data as DailyClosing[] })
          console.debug('[Sync] daily_closings recuperados do Supabase:', data.length)
        }
      }
    }),
    {
      name: 'agendaec-closings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
