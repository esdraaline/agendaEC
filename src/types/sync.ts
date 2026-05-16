export type MutationType =
  | 'task_create'
  | 'task_update'
  | 'task_delete'

export interface PendingMutation {
  id: string
  type: MutationType
  entityId: string
  payload: unknown
  createdAt: string
  synced: boolean
}
