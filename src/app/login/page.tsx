'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import LoginForm from '@/components/features/auth/LoginForm'
import FullPageSpinner from '@/components/shared/FullPageSpinner'

function LoginContent() {
  const { session, loading } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && session) {
      const next = searchParams.get('next') ?? '/hoje'
      router.replace(next)
    }
  }, [session, loading, router, searchParams])

  if (loading) return <FullPageSpinner />

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">AgendaEC</h1>
        <p className="mb-8 text-sm text-gray-500">Loja de cosméticos</p>
        <LoginForm />
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <LoginContent />
    </Suspense>
  )
}
