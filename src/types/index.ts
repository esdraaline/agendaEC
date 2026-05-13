export type UserRole = 'owner' | 'staff' | 'viewer'
export type EntryOrigin = 'manual' | 'whatsapp_share' | 'audio'
export type EntryType = 'sale' | 'payment' | 'delivery' | 'task' | 'appointment' | 'free_note'
export type EntryStatus = 'pending' | 'processing' | 'confirmed' | 'free_note'
export type SaleStatus = 'pending' | 'confirmed' | 'cancelled'
export type DeliveryStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'normal' | 'high'

export interface Store {
  id: string
  owner_id: string
  name: string
  timezone: string
  settings: Record<string, unknown>
  created_at: string
}

export interface StoreUser {
  id: string
  store_id: string
  user_id: string
  role: UserRole
  name: string | null
  active: boolean
  created_at: string
}

export interface Client {
  id: string
  store_id: string
  name: string
  phone: string | null
  tags: string[]
  notes: string | null
  balance: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Entry {
  id: string
  store_id: string
  created_by: string | null
  raw_text: string
  origin: EntryOrigin
  type: EntryType | null
  status: EntryStatus
  ai_metadata: Record<string, unknown> | null
  confidence: number | null
  linked_id: string | null
  linked_table: string | null
  created_at: string
}

export interface Sale {
  id: string
  store_id: string
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

export interface Payment {
  id: string
  store_id: string
  sale_id: string | null
  client_id: string | null
  amount: number
  payment_method: string | null
  notes: string | null
  payment_date: string
  deleted_at: string | null
  created_at: string
}

export interface Delivery {
  id: string
  store_id: string
  sale_id: string | null
  client_id: string | null
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

export interface Task {
  id: string
  store_id: string
  created_by: string | null
  title: string
  priority: TaskPriority
  category: string | null
  due_date: string | null
  completed: boolean
  completed_at: string | null
  deleted_at: string | null
  created_at: string
}

export interface Appointment {
  id: string
  store_id: string
  client_id: string | null
  title: string
  date: string
  time: string | null
  notes: string | null
  notified_wa: boolean
  created_at: string
  updated_at: string
}

export interface WaMessage {
  id: string
  store_id: string
  client_id: string | null
  sent_by: string | null
  linked_id: string | null
  linked_table: string | null
  template: string | null
  message_text: string
  phone: string
  deleted_at: string | null
  created_at: string
}

export interface WaTemplate {
  id: string
  store_id: string
  type: string
  label: string
  template: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DailyClosing {
  id: string
  store_id: string
  closing_date: string
  total_sales: number | null
  total_cash: number | null
  total_pix: number | null
  total_card: number | null
  total_fiado: number | null
  summary_data: Record<string, unknown> | null
  confirmed: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  store_id: string | null
  user_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export type MutationOperation = 'insert' | 'update' | 'delete'

export interface PendingMutation {
  id: string
  table: string
  operation: MutationOperation
  payload: Record<string, unknown>
  created_at: string
  retries: number
}
