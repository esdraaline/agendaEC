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

export interface PendingMutation {
  id: string
  type: MutationType
  entityId: string
  payload: unknown
  createdAt: string
  synced: boolean
}
