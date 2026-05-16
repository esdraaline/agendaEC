import { Task, TaskPriority } from '@/types/task'

export function buildTask(raw_text: string, date: string | null, priority: TaskPriority): Task {
  // Limpeza usando termos normalizados (sem acentos)
  let title = raw_text
    .replace(/hoje|amanha|amanhã|segunda|terca|terça|quarta|quinta|sexta|sabado|sábado|domingo/gi, '')
    .replace(/prioridade alta|prioridade baixa|urgente|p1|p3/gi, '')
    .replace(/\d{1,2}\/\d{1,2}/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!title) title = raw_text.substring(0, 50)

  const task: Task = {
    id: crypto.randomUUID(),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    priority,
    due_date: date,
    completed: false,
    created_at: new Date().toISOString(),
  }

  console.debug('[Parser] Task built', task)
  return task
}
