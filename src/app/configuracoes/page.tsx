'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useQueueStore } from '@/stores/queueStore'
import { syncPendingMutations } from '@/lib/sync/syncEngine'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function ConfiguracoesPage() {
  const { loading } = useRequireAuth()
  const { mutations } = useQueueStore()
  const [syncing, setSyncing] = useState(false)

  const pendingCount = mutations.filter((m) => !m.synced).length

  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncPendingMutations()
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return <FullPageSpinner />

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Configurações</h1>
          <p className="text-sm text-gray-500">Gerencie sua conta e sincronização</p>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-medium mb-2">Sincronização</h2>
          <p className="text-sm text-gray-600 mb-4">
            {pendingCount > 0
              ? `Você tem ${pendingCount} alterações pendentes para sincronizar.`
              : 'Seus dados estão sincronizados.'}
          </p>
          <Button 
            onClick={handleSync} 
            disabled={syncing || pendingCount === 0}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </Button>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-medium mb-2">WhatsApp</h2>
          <p className="text-sm text-gray-600 mb-4">
            Gerencie os templates de mensagens rápidas.
          </p>
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.location.href = '/configuracoes/templates'}
          >
            Editar Templates
          </Button>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Versão 0.4.0 — WhatsApp + Cobranças
        </div>
      </div>
    </Layout>
  )
}
