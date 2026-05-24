'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useClientsStore } from '@/stores/clientsStore'
import { useTemplatesStore } from '@/stores/templatesStore'
import { buildWaLink } from '@/lib/whatsapp/deeplink'
import { parseTemplate } from '@/lib/whatsapp/templates'
import { Button } from '@/components/ui/button'
import { Search, Plus, MessageCircle } from 'lucide-react'

export default function ClientesPage() {
  const { loading } = useRequireAuth()
  const { clients, addClient } = useClientsStore()
  const { templates } = useTemplatesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  if (loading) return <FullPageSpinner />

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    addClient({
      id: crypto.randomUUID(),
      name: newName.trim(),
      phone: newPhone.trim() || null,
      notes: null,
      balance: 0,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    setNewName('')
    setNewPhone('')
    setIsAdding(false)
  }

  const filteredClients = clients
    .filter((c) => !c.deleted_at)
    .filter((c) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleCobrar = (client: typeof clients[0]) => {
    if (!client.phone) return

    const template = templates[0]
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Clientes</h1>
            <p className="text-sm text-gray-500">Gerencie seus contatos</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`${isAdding ? 'bg-gray-100 text-gray-600' : 'bg-black text-white'} p-2 rounded-full shadow-lg active:scale-95 transition-transform`}
          >
            <Plus size={24} className={`transition-transform ${isAdding ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddClient} className="bg-white border-2 border-black rounded-2xl p-4 shadow-xl space-y-4 animate-in slide-in-from-top-4">
            <h2 className="font-bold">Novo Cliente</h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Nome</label>
              <input
                type="text"
                required
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="Ex: Renata Silva"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">WhatsApp (opcional)</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="Ex: 11999999999"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-bold active:bg-gray-900"
            >
              Salvar Cliente
            </button>
          </form>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div 
                key={client.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    {client.phone && (
                      <p className="text-xs text-gray-500 mt-0.5">{client.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${client.balance < 0 ? 'text-red-500' : client.balance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {client.balance < 0 ? `Deve R$ ${Math.abs(client.balance).toFixed(2).replace('.', ',')}` : 
                       client.balance > 0 ? `Crédito R$ ${client.balance.toFixed(2).replace('.', ',')}` : 
                       'Saldo zerado'}
                    </p>
                  </div>
                </div>

                {client.balance < 0 && client.phone && (
                  <div className="pt-2 border-t border-gray-50">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 font-bold h-9 text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCobrar(client)
                      }}
                    >
                      <MessageCircle size={16} />
                      Cobrar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
