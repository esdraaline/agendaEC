'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useDeliveriesStore } from '@/stores/deliveriesStore'
import { useAppointmentsStore } from '@/stores/appointmentsStore'
import { format } from 'date-fns'
import { Plus, MapPin, Clock, Calendar, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CentralPage() {
  const { loading } = useRequireAuth()
  const { deliveries, addDelivery, updateStatus } = useDeliveriesStore()
  const { appointments, addAppointment } = useAppointmentsStore()
  
  const [activeTab, setActiveTab] = useState<'entregas' | 'agenda'>('entregas')
  const [isAdding, setIsAdding] = useState(false)
  
  const [titleDesc, setTitleDesc] = useState('')
  const [addressTime, setAddressTime] = useState('')

  if (loading) return <FullPageSpinner />

  const today = format(new Date(), 'yyyy-MM-dd')
  const normalizeDate = (value: string | null) => value ? value.slice(0, 10) : ''

  const todaysDeliveries = deliveries.filter(d => normalizeDate(d.scheduled_date) === today && !d.deleted_at)
  const todaysAppointments = appointments.filter(a => normalizeDate(a.date) === today)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleDesc.trim()) return

    if (activeTab === 'entregas') {
      addDelivery({
        id: crypto.randomUUID(),
        client_id: null,
        sale_id: null,
        description: titleDesc,
        address: addressTime || null,
        scheduled_date: today,
        scheduled_time: null,
        status: 'scheduled',
        notified_wa: false,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } else {
      addAppointment({
        id: crypto.randomUUID(),
        client_id: null,
        title: titleDesc,
        date: today,
        time: addressTime || null,
        notes: null,
        notified_wa: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    setTitleDesc('')
    setAddressTime('')
    setIsAdding(false)
  }

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Central</h1>
          <p className="text-sm text-gray-500">Agenda e Entregas de Hoje</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'entregas' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            onClick={() => setActiveTab('entregas')}
          >
            Entregas ({todaysDeliveries.length})
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'agenda' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            onClick={() => setActiveTab('agenda')}
          >
            Agenda ({todaysAppointments.length})
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4 animate-in slide-in-from-top-4">
            <h2 className="font-bold">{activeTab === 'entregas' ? 'Nova Entrega Hoje' : 'Novo Compromisso Hoje'}</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                {activeTab === 'entregas' ? 'Produto / Descrição' : 'Título do Compromisso'}
              </label>
              <input
                type="text"
                required
                autoFocus
                value={titleDesc}
                onChange={(e) => setTitleDesc(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder={activeTab === 'entregas' ? 'Ex: Kit Shampoo Renata' : 'Ex: Visita Fornecedor'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">
                {activeTab === 'entregas' ? 'Endereço (opcional)' : 'Horário (opcional)'}
              </label>
              <input
                type={activeTab === 'entregas' ? 'text' : 'time'}
                value={addressTime}
                onChange={(e) => setAddressTime(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder={activeTab === 'entregas' ? 'Ex: Rua das Flores, 123' : ''}
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-900 text-white">
                Salvar
              </Button>
            </div>
          </form>
        )}

        {!isAdding && (
          <Button 
            className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} />
            {activeTab === 'entregas' ? 'Adicionar Entrega' : 'Adicionar Compromisso'}
          </Button>
        )}

        <div className="space-y-3">
          {activeTab === 'entregas' && todaysDeliveries.length === 0 && !isAdding && (
            <p className="text-center text-sm text-gray-500 py-10">Nenhuma entrega agendada para hoje.</p>
          )}

          {activeTab === 'agenda' && todaysAppointments.length === 0 && !isAdding && (
            <p className="text-center text-sm text-gray-500 py-10">Nenhum compromisso agendado para hoje.</p>
          )}

          {activeTab === 'entregas' && todaysDeliveries.map(d => (
            <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-3">
              <button onClick={() => updateStatus(d.id, d.status === 'completed' ? 'scheduled' : 'completed')} className="mt-0.5">
                {d.status === 'completed' ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
              </button>
              <div className="flex-1">
                <p className={`font-semibold ${d.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{d.description}</p>
                {d.address && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {d.address}
                  </p>
                )}
              </div>
            </div>
          ))}

          {activeTab === 'agenda' && todaysAppointments.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{a.title}</p>
                {a.time && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={12} /> {a.time}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
