import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DailyClosing } from '@/types/dailyClosing'
import { useQueueStore } from './queueStore'

interface DailyClosingsState {
  closings: DailyClosing[]
  addClosing: (closing: DailyClosing) => void
}

export const useDailyClosingsStore = create<DailyClosingsState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'agendaec-closings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
