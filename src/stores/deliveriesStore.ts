import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Delivery, DeliveryStatus } from '@/types/delivery'
import { useQueueStore } from './queueStore'

interface DeliveriesState {
  deliveries: Delivery[]
  addDelivery: (delivery: Delivery) => void
  updateDelivery: (id: string, updates: Partial<Delivery>) => void
  updateStatus: (id: string, status: DeliveryStatus) => void
}

export const useDeliveriesStore = create<DeliveriesState>()(
  persist(
    (set) => ({
      deliveries: [],
      addDelivery: (delivery) => {
        set((state) => ({
          deliveries: [delivery, ...state.deliveries],
        }))
        useQueueStore.getState().enqueue({
          type: 'delivery_create',
          entityId: delivery.id,
          payload: delivery,
        })
      },
      updateDelivery: (id, updates) => {
        let updatedDelivery: Delivery | undefined
        set((state) => {
          const newDeliveries = state.deliveries.map((d) => {
            if (d.id !== id) return d
            updatedDelivery = { ...d, ...updates, updated_at: new Date().toISOString() }
            return updatedDelivery
          })
          return { deliveries: newDeliveries }
        })
        if (updatedDelivery) {
          useQueueStore.getState().enqueue({
            type: 'delivery_update',
            entityId: id,
            payload: updatedDelivery,
          })
        }
      },
      updateStatus: (id, status) => {
        let updatedDelivery: Delivery | undefined
        set((state) => {
          const newDeliveries = state.deliveries.map((d) => {
            if (d.id !== id) return d
            updatedDelivery = { ...d, status, updated_at: new Date().toISOString() }
            return updatedDelivery
          })
          return { deliveries: newDeliveries }
        })
        if (updatedDelivery) {
          useQueueStore.getState().enqueue({
            type: 'delivery_update',
            entityId: id,
            payload: { status, updated_at: updatedDelivery.updated_at },
          })
        }
      },
    }),
    {
      name: 'agendaec-deliveries',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
