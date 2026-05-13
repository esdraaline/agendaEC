import { create } from 'zustand'
import type { Store, StoreUser } from '@/types'

interface ContextState {
  store: Store | null
  storeUser: StoreUser | null
  setStore: (store: Store | null) => void
  setStoreUser: (storeUser: StoreUser | null) => void
}

export const useContextStore = create<ContextState>((set) => ({
  store: null,
  storeUser: null,
  setStore: (store) => set({ store }),
  setStoreUser: (storeUser) => set({ storeUser }),
}))
