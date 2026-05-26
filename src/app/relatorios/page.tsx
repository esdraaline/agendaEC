'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format, startOfMonth, subMonths, addMonths, isSameMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Copy, Check } from 'lucide-react'
import { useDailyClosingsStore } from '@/stores/dailyClosingsStore'
import { generateMonthlySummaryText, downloadMonthlyCSV } from '@/lib/exportUtils'

export default function RelatoriosPage() {
  const router = useRouter()
  const { closings } = useDailyClosingsStore()
  const [currentDate, setCurrentDate] = useState(() => startOfMonth(new Date()))
  const [copied, setCopied] = useState(false)

  // Filtra fechamentos do mês atual
  const monthlyClosings = useMemo(() => {
    return closings.filter(c => {
      if (!c.closing_date) return false
      return isSameMonth(parseISO(c.closing_date), currentDate)
    })
  }, [closings, currentDate])

  // Agregadores
  const totals = useMemo(() => {
    return {
      faturado: monthlyClosings.reduce((acc, c) => acc + (c.total_sales || 0), 0),
      pix: monthlyClosings.reduce((acc, c) => acc + (c.total_pix || 0), 0),
      dinheiro: monthlyClosings.reduce((acc, c) => acc + (c.total_cash || 0), 0),
      cartao: monthlyClosings.reduce((acc, c) => acc + (c.total_card || 0), 0),
      fiado: monthlyClosings.reduce((acc, c) => acc + (c.total_fiado || 0), 0),
    }
  }, [monthlyClosings])

  const monthLabel = format(currentDate, 'MMMM yyyy', { locale: ptBR })
  // Capitaliza primeira letra do mês
  const formattedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const handleNextMonth = () => {
    if (isSameMonth(currentDate, new Date())) return
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleCopyText = async () => {
    const text = generateMonthlySummaryText(monthlyClosings, formattedMonthLabel)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar', err)
      alert('Não foi possível copiar o texto.')
    }
  }

  const handleDownloadCSV = () => {
    downloadMonthlyCSV(monthlyClosings, formattedMonthLabel)
  }

  const isCurrentMonth = isSameMonth(currentDate, new Date())

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 flex items-center sticky top-0 z-10">
        <button onClick={() => router.back()} className="mr-3 text-gray-700 p-1 -ml-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full p-4 flex flex-col gap-6">
        
        {/* Navegação de Mês */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-between">
          <button 
            onClick={handlePrevMonth}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-medium text-gray-800 text-lg">
            {formattedMonthLabel}
          </span>
          <button 
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className={`p-2 rounded-full transition-colors ${
              isCurrentMonth ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-violet-50/50">
            <p className="text-sm text-gray-500 font-medium mb-1">Total Faturado no Mês</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.faturado)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Baseado em {monthlyClosings.length} fechamentos diários
            </p>
          </div>

          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pix</p>
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.pix)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dinheiro</p>
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.dinheiro)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cartão</p>
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.cartao)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fiado</p>
              <p className="font-medium text-amber-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.fiado)}
              </p>
            </div>
          </div>
        </div>

        {/* Ações de Exportação */}
        <div className="space-y-3 mt-2">
          <button
            onClick={handleCopyText}
            className="w-full bg-white border border-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-500" />}
            {copied ? 'Copiado para o WhatsApp!' : 'Copiar Texto para WhatsApp'}
          </button>

          <button
            onClick={handleDownloadCSV}
            className="w-full bg-violet-600 border border-transparent text-white font-medium py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors"
          >
            <Download size={20} />
            Baixar CSV para Contador
          </button>
        </div>

      </main>
    </div>
  )
}
