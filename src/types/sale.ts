export type SaleStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Sale {
  id: string
  client_id: string | null
  entry_id: string | null
  description: string | null
  total_amount: number
  paid_amount: number
  status: SaleStatus
  notes: string | null
  origin: string
  sale_date: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}
