export interface DailyClosing {
  id: string
  closing_date: string
  total_sales: number
  total_cash: number
  total_pix: number
  total_card: number
  total_fiado: number
  summary_data: Record<string, unknown>
  confirmed: boolean
  created_at: string
}
