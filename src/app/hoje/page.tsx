'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'

export default function HojePage() {
  const { loading } = useRequireAuth()

  if (loading) return <FullPageSpinner />

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Hoje</h1>
        <p className="text-sm text-gray-500">Sprint 3 — em breve</p>
      </div>
    </Layout>
  )
}
