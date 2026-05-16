export interface Client {
  id: string
  name: string
  phone: string | null
  notes: string | null
  balance: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}
