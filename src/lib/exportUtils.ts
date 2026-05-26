import { DailyClosing } from '@/types/dailyClosing'

export function generateMonthlySummaryText(closings: DailyClosing[], monthLabel: string): string {
  const totalFaturado = closings.reduce((acc, c) => acc + (c.total_sales || 0), 0)
  const totalPix = closings.reduce((acc, c) => acc + (c.total_pix || 0), 0)
  const totalDinheiro = closings.reduce((acc, c) => acc + (c.total_cash || 0), 0)
  const totalCartao = closings.reduce((acc, c) => acc + (c.total_card || 0), 0)
  const totalFiado = closings.reduce((acc, c) => acc + (c.total_fiado || 0), 0)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return `*Resumo Mensal - ${monthLabel}*

Total Faturado: ${formatCurrency(totalFaturado)}

*Recebimentos:*
PIX: ${formatCurrency(totalPix)}
Dinheiro: ${formatCurrency(totalDinheiro)}
Cartão: ${formatCurrency(totalCartao)}
Fiado: ${formatCurrency(totalFiado)}

_Gerado por AgendaEC_`
}

export function downloadMonthlyCSV(closings: DailyClosing[], monthLabel: string) {
  // Cabeçalho do CSV
  const headers = ['Data', 'Total Faturado', 'PIX', 'Dinheiro', 'Cartao', 'Fiado']

  // Linhas do CSV (ordenadas por data, da mais antiga para mais nova)
  const sortedClosings = [...closings].sort((a, b) => a.closing_date.localeCompare(b.closing_date))
  
  const rows = sortedClosings.map(c => {
    return [
      c.closing_date,
      c.total_sales?.toFixed(2) || '0.00',
      c.total_pix?.toFixed(2) || '0.00',
      c.total_cash?.toFixed(2) || '0.00',
      c.total_card?.toFixed(2) || '0.00',
      c.total_fiado?.toFixed(2) || '0.00'
    ]
  })

  // Adiciona a linha de total
  const totalFaturado = closings.reduce((acc, c) => acc + (c.total_sales || 0), 0)
  const totalPix = closings.reduce((acc, c) => acc + (c.total_pix || 0), 0)
  const totalDinheiro = closings.reduce((acc, c) => acc + (c.total_cash || 0), 0)
  const totalCartao = closings.reduce((acc, c) => acc + (c.total_card || 0), 0)
  const totalFiado = closings.reduce((acc, c) => acc + (c.total_fiado || 0), 0)

  rows.push([
    'TOTAL',
    totalFaturado.toFixed(2),
    totalPix.toFixed(2),
    totalDinheiro.toFixed(2),
    totalCartao.toFixed(2),
    totalFiado.toFixed(2)
  ])

  // Monta o conteúdo CSV separando por ponto e vírgula
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n')

  // Cria o blob e dispara o download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `relatorio_${monthLabel.replace(/\s+/g, '_').toLowerCase()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
