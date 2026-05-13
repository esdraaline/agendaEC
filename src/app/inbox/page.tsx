'use client'

import { Suspense } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import InboxForm from '@/components/features/inbox/InboxForm'

export default function InboxPage() {
  const { loading } = useRequireAuth()

  if (loading) return null

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Inbox</h1>
        <Suspense>
          <InboxForm />
        </Suspense>
      </div>
    </Layout>
  )
}
