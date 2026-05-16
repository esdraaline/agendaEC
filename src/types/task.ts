export type TaskPriority = 'low' | 'normal' | 'high'

export type Task = {
  id: string
  title: string
  priority: TaskPriority
  due_date: string | null
  completed: boolean
  created_at: string
}
