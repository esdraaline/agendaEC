'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useSalesStore } from '@/stores/salesStore'
import { useDailyClosingsStore } from '@/stores/dailyClosingsStore'
import { format } from 'date-fns'
import { CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function FechamentoPage() {
  const { loading } = useRequireAuth()
  const { sales } = useSalesStore()
  const { closings, addClosing } = useDailyClosingsStore()
  const router = useRouter()
  
  const [isClosing, setIsClosing] = useState(false)

  if (loading) return <FullPageSpinner />

  const today = format(new Date(), 'yyyy-MM-dd')
  const normalizeDate = (value: string) => value.slice(0, 10)

  const isAlreadyClosed = closings.some(c => c.closing_date === today)

  const todaysSales = sales.filter(
    (s) =>
      normalizeDate(s.sale_date) === today &&
      !s.deleted_at &&
      s.status !== 'cancelled'
  )

  const totalSales = todaysSales.reduce((acc, sale) => acc + sale.total_amount, 0)
  const totalReceived = todaysSales.reduce((acc, sale) => acc + sale.paid_amount, 0)
  const totalPix = todaysSales.filter(s => s.payment_method === 'pix').reduce((acc, sale) => acc + sale.paid_amount, 0)
  const totalCard = todaysSales.filter(s => s.payment_method === 'card').reduce((acc, sale) => acc + sale.paid_amount, 0)
  const totalCash = totalReceived - totalPix - totalCard
  const totalFiado = totalSales - totalReceived

  const handleFechamento = () => {
    setIsClosing(true)
    setTimeout(() => {
      addClosing({
        id: crypto.randomUUID(),
        closing_date: today,
        total_sales: totalSales,
        total_cash: totalCash,
        total_pix: totalPix,
        total_card: totalCard,
        total_fiado: totalFiado > 0 ? totalFiado : 0,
        summary_data: { salesCount: todaysSales.length },
        confirmed: true,
        created_at: new Date().toISOString()
      })
      setIsClosing(false)
    }, 800)
  }

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Fechamento do Dia</h1>
          <p className="text-sm text-gray-500">Resumo financeiro de hoje</p>
        </div>

        {isAlreadyClosed ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 size={48} className="text-green-500" />
            <h2 className="text-xl font-bold text-green-800">Dia Fechado!</h2>
            <p className="text-sm text-green-600">O caixa de hoje já foi encerrado e consolidado.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/hoje')}>
              Voltar para Início
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <p className="text-gray-500">Data</p>
                <p className="font-semibold text-gray-900">{format(new Date(), 'dd/MM/yyyy')}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Total Vendido</p>
                  <p className="font-bold text-lg text-gray-900">R$ {totalSales.toFixed(2).replace('.', ',')}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Total Recebido</p>
                  <p className="font-bold text-lg text-green-600">R$ {totalReceived.toFixed(2).replace('.', ',')}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">Pendente (Fiado)</p>
                  <p className={`font-bold text-lg ${totalFiado > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    R$ {Math.max(totalFiado, 0).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-2 h-12 text-lg font-bold shadow-lg"
              onClick={handleFechamento}
              disabled={isClosing}
            >
              {isClosing ? (
                'Fechando Caixa...'
              ) : (
                <>
                  <Lock size={20} />
                  Confirmar Fechamento
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 px-4">
              Ao confirmar o fechamento, os valores não poderão ser alterados para este dia.
            </p>
          </>
        )}
      </div>
    </Layout>
  )
}
