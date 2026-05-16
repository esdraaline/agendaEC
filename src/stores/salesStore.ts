import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Sale } from '@/types/sale'
import { useQueueStore } from './queueStore'

interface SalesState {
  sales: Sale[]
  addSale: (sale: Sale) => void
  updateSale: (id: string, updates: Partial<Sale>) => void
  removeSale: (id: string) => void
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set) => ({
      sales: [],
      addSale: (sale) => {
        set((state) => ({
          sales: [sale, ...state.sales],
        }))

        console.debug('[Sales] Sale added', sale)

        useQueueStore.getState().enqueue({
          type: 'sale_create',
          entityId: sale.id,
          payload: sale,
        })
      },
      updateSale: (id, updates) => {
        let updatedSale: Sale | undefined

        set((state) => {
          const newSales = state.sales.map((s) => {
            if (s.id !== id) return s

            updatedSale = {
              ...s,
              ...updates,
              updated_at: new Date().toISOString(),
            }

            return updatedSale
          })

          return {
            sales: newSales,
          }
        })

        console.debug('[Sales] Sale updated', id)

        if (updatedSale) {
          useQueueStore.getState().enqueue({
            type: 'sale_update',
            entityId: id,
            payload: updatedSale,
          })
        }
      },
      removeSale: (id) => {
        set((state) => {
          const newSales = state.sales.map((s) =>
            s.id === id ? { ...s, deleted_at: new Date().toISOString() } : s
          )
          return { sales: newSales }
        })

        console.debug('[Sales] Sale soft removed', id)

        useQueueStore.getState().enqueue({
          type: 'sale_delete',
          entityId: id,
          payload: { deleted_at: new Date().toISOString() },
        })
      },
    }),
    {
      name: 'agendaec-sales',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
