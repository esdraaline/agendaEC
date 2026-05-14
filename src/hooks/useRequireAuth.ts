'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export function useRequireAuth() {
  const { session, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      const next = window.location.pathname + window.location.search
      router.replace(`/login?next=${encodeURIComponent(next)}`)
    }
  }, [session, loading, router])

  return { session, loading }
}
