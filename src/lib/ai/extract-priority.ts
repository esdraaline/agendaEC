import { TaskPriority } from '@/types/task'

export function extractPriority(input: string): TaskPriority {
  if (input.includes('prioridade alta') || input.includes('urgente') || input.includes('p1')) {
    return 'high'
  }
  if (input.includes('prioridade baixa') || input.includes('p3')) {
    return 'low'
  }
  return 'normal'
}
