export type MutationType =
  | 'task_create'
  | 'task_update'
  | 'task_delete'
  | 'sale_create'
  | 'sale_update'
  | 'sale_delete'
  | 'client_create'
  | 'client_update'
  | 'client_delete'
  | 'delivery_create'
  | 'delivery_update'
  | 'delivery_delete'
  | 'appointment_create'
  | 'appointment_update'
  | 'appointment_delete'
  | 'daily_closing_create'
  | 'product_create'
  | 'product_update'
  | 'product_delete'

export interface PendingMutation {
  id: string
  type: MutationType
  entityId: string
  payload: unknown
  createdAt: string
  synced: boolean
}
