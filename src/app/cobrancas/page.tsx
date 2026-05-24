'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useClientsStore } from '@/stores/clientsStore'
import { useTemplatesStore } from '@/stores/templatesStore'
import { buildWaLink } from '@/lib/whatsapp/deeplink'
import { parseTemplate } from '@/lib/whatsapp/templates'
import { Button } from '@/components/ui/button'
import { Banknote, MessageCircle } from 'lucide-react'

export default function CobrancasPage() {
  const { loading } = useRequireAuth()
  const { clients } = useClientsStore()
  const { templates } = useTemplatesStore()

  if (loading) return <FullPageSpinner />

  // Filtrar apenas clientes que possuem saldo negativo (estão devendo)
  const debtors = clients
    .filter((c) => !c.deleted_at && c.balance < 0)
    .sort((a, b) => a.balance - b.balance) // os que devem mais aparecem primeiro (menor valor absoluto negativo)

  const totalEmAberto = debtors.reduce((sum, c) => sum + Math.abs(c.balance), 0)

  const handleCobrar = (client: typeof clients[0]) => {
    if (!client.phone) {
      alert('Este cliente não possui telefone cadastrado.')
      return
    }

    const template = templates[0] // usa o primeiro template por padrão
    if (!template) {
      alert('Nenhum template de cobrança configurado.')
      return
    }

    const valorDevido = Math.abs(client.balance).toFixed(2).replace('.', ',')
    
    const message = parseTemplate(template.content, {
      nome: client.name,
      saldo: `R$ ${valorDevido}`,
    })

    const link = buildWaLink(client.phone, message)
    window.open(link, '_blank')
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <Banknote size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cobranças</h1>
            <p className="text-sm text-gray-500">Saldos pendentes</p>
          </div>
        </div>

        <div className="bg-white border-2 border-red-100 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center py-6">
          <p className="text-sm text-gray-500 font-medium mb-1">Total a receber</p>
          <p className="text-3xl font-bold text-red-600">
            R$ {totalEmAberto.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            De {debtors.length} {debtors.length === 1 ? 'cliente' : 'clientes'}
          </p>
        </div>

        <div className="space-y-3">
          {debtors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Ufa! Ninguém está te devendo. 🎉</p>
            </div>
          ) : (
            debtors.map((client) => (
              <div 
                key={client.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    {client.phone ? (
                      <p className="text-xs text-gray-500 mt-0.5">{client.phone}</p>
                    ) : (
                      <p className="text-xs text-orange-500 mt-0.5">Sem telefone</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-red-500">
                      R$ {Math.abs(client.balance).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 font-bold"
                    onClick={() => handleCobrar(client)}
                    disabled={!client.phone}
                  >
                    <MessageCircle size={18} />
                    Cobrar no WhatsApp
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
