'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useTasksStore } from '@/stores/tasksStore'
import { useSalesStore } from '@/stores/salesStore'
import { useDeliveriesStore } from '@/stores/deliveriesStore'
import { useAppointmentsStore } from '@/stores/appointmentsStore'
import { format } from 'date-fns'
import { Plus, DollarSign, Calendar, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HojePage() {
  const { loading } = useRequireAuth()
  const { tasks, toggleTask } = useTasksStore()
  const { sales, addSale } = useSalesStore()
  const { deliveries } = useDeliveriesStore()
  const { appointments } = useAppointmentsStore()
  const router = useRouter()
  const [isAddingSale, setIsAddingSale] = useState(false)
  const [saleAmount, setSaleAmount] = useState('')
  const [saleDesc, setSaleDesc] = useState('')

  if (loading) return <FullPageSpinner />

  const handleAddQuickSale = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(saleAmount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) return

    const now = new Date().toISOString()
    addSale({
      id: crypto.randomUUID(),
      client_id: null,
      entry_id: null,
      description: saleDesc.trim() || 'Venda rápida',
      total_amount: amount,
      paid_amount: amount,
      status: 'confirmed',
      notes: 'Venda rápida registrada manualmente',
      origin: 'manual',
      sale_date: format(new Date(), 'yyyy-MM-dd'),
      deleted_at: null,
      created_at: now,
      updated_at: now,
    })

    setSaleAmount('')
    setSaleDesc('')
    setIsAddingSale(false)
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const normalizeDate = (value: string) => value.slice(0, 10)
  
  const todaysTasks = tasks.filter(
    (t) =>
      t.due_date &&
      normalizeDate(t.due_date) === today &&
      !t.completed
  )
  
  const todaysSales = sales.filter(
    (s) =>
      normalizeDate(s.sale_date) === today &&
      !s.deleted_at &&
      s.status !== 'cancelled'
  )
  
  const todaysDeliveriesPending = deliveries.filter(
    (d) => normalizeDate(d.scheduled_date) === today && !d.deleted_at && d.status !== 'completed' && d.status !== 'cancelled'
  )
  const todaysAppointmentsCount = appointments.filter(
    (a) => normalizeDate(a.date) === today
  ).length
  
  const faturamento = todaysSales.reduce((acc, sale) => acc + sale.total_amount, 0)
  const recebido = todaysSales.reduce((acc, sale) => acc + sale.paid_amount, 0)

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hoje</h1>
            <p className="text-sm text-gray-500">Resumo do dia</p>
          </div>
          <button 
            onClick={() => setIsAddingSale(!isAddingSale)}
            className={`${isAddingSale ? 'bg-gray-100 text-gray-600' : 'bg-black text-white'} p-2 rounded-full shadow-lg active:scale-95 transition-transform`}
          >
            <Plus size={24} className={`transition-transform ${isAddingSale ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {isAddingSale && (
          <form onSubmit={handleAddQuickSale} className="bg-white border-2 border-black rounded-2xl p-4 shadow-xl space-y-4 animate-in slide-in-from-top-4">
            <h2 className="font-bold flex items-center gap-2 text-gray-900">
              <DollarSign size={18} /> Venda Rápida
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Valor (R$)</label>
              <input
                type="text"
                required
                autoFocus
                inputMode="decimal"
                value={saleAmount}
                onChange={(e) => setSaleAmount(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Descrição (opcional)</label>
              <input
                type="text"
                value={saleDesc}
                onChange={(e) => setSaleDesc(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="Ex: Tintura Loreal"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-bold active:bg-gray-900"
            >
              Confirmar Venda
            </button>
          </form>
        )}

        {/* Sales Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Faturado</p>
            <p className="text-xl font-bold text-gray-900">
              R$ {faturamento.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-center">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Recebido</p>
            <p className="text-xl font-bold text-green-600">
              R$ {recebido.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        {/* Central Summary */}
        <div 
          onClick={() => router.push('/central')}
          className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
        >
          <div>
            <h2 className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              Agenda e Entregas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {todaysDeliveriesPending.length} entregas pendentes • {todaysAppointmentsCount} compromissos
            </p>
          </div>
          <div className="text-blue-500 bg-blue-50 p-2 rounded-lg font-semibold text-sm">
            Central
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-medium mb-3 flex items-center gap-2">
            Tarefas Pendentes
            <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">
              {todaysTasks.length}
            </span>
          </h2>
          
          {todaysTasks.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-2">Nenhuma tarefa para hoje.</p>
          ) : (
            <ul className="space-y-3">
              {todaysTasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {task.priority === 'high' && (
                      <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Urgente
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Fechamento */}
        <div className="pt-4 border-t border-gray-100 mt-6 pb-20">
          <button
            onClick={() => router.push('/fechamento')}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
          >
            <Lock size={18} />
            Realizar Fechamento do Dia
          </button>
        </div>
      </div>
    </Layout>
  )
}
