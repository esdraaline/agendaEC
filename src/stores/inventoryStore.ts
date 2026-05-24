import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/types/product'
import { useQueueStore } from './queueStore'

interface InventoryState {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  adjustStock: (id: string, amount: number) => void
  removeProduct: (id: string) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
        }))
        useQueueStore.getState().enqueue({
          type: 'product_create',
          entityId: product.id,
          payload: product,
        })
      },
      updateProduct: (id, updates) => {
        let updatedProduct: Product | undefined
        set((state) => {
          const newProducts = state.products.map((p) => {
            if (p.id !== id) return p
            updatedProduct = { ...p, ...updates, updated_at: new Date().toISOString() }
            return updatedProduct
          })
          return { products: newProducts }
        })
        if (updatedProduct) {
          useQueueStore.getState().enqueue({
            type: 'product_update',
            entityId: id,
            payload: updatedProduct,
          })
        }
      },
      adjustStock: (id, amount) => {
        let updatedProduct: Product | undefined
        set((state) => {
          const newProducts = state.products.map((p) => {
            if (p.id !== id) return p
            const newStock = Math.max(0, p.stock_quantity + amount)
            updatedProduct = { ...p, stock_quantity: newStock, updated_at: new Date().toISOString() }
            return updatedProduct
          })
          return { products: newProducts }
        })
        if (updatedProduct) {
          useQueueStore.getState().enqueue({
            type: 'product_update',
            entityId: id,
            payload: { stock_quantity: updatedProduct.stock_quantity, updated_at: updatedProduct.updated_at },
          })
        }
      },
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p
          )
        }))
        useQueueStore.getState().enqueue({
          type: 'product_delete',
          entityId: id,
          payload: { deleted_at: new Date().toISOString() },
        })
      },
    }),
    {
      name: 'agendaec-inventory',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
