'use client'

import { useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useContextStore } from '@/stores/contextStore'
import { useDailyClosingsStore } from '@/stores/dailyClosingsStore'
import { useSalesStore } from '@/stores/salesStore'
import { useClientsStore } from '@/stores/clientsStore'
import { useTasksStore } from '@/stores/tasksStore'
import { Store } from '@/types'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading } = useAuthStore()

  useEffect(() => {
    const initStoreContext = async (session: Session | null) => {
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', session.user.id)
        .single()

      if (error || !data) {
        console.error('[Auth] Erro ao buscar store_id:', error)
        return
      }

      const storeId = data.store_id
      useContextStore.getState().setStore({ id: storeId } as unknown as Store)
      
      // Inbound Sync
      useDailyClosingsStore.getState().fetchFromRemote(storeId)
      useSalesStore.getState().fetchFromRemote(storeId)
      useClientsStore.getState().fetchFromRemote(storeId)
      useTasksStore.getState().fetchFromRemote(storeId)
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      initStoreContext(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
      initStoreContext(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setLoading])

  return <>{children}</>
}
