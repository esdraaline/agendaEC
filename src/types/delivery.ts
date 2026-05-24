export type DeliveryStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface Delivery {
  id: string
  client_id: string | null
  sale_id: string | null
  description: string
  address: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  status: DeliveryStatus
  notified_wa: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}
