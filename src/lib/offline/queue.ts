import type { PendingMutation, MutationOperation } from '@/types'

const STORAGE_KEY = 'agendaec:pending_mutations'

export function getQueue(): PendingMutation[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveQueue(queue: PendingMutation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function enqueue(
  table: string,
  operation: MutationOperation,
  payload: Record<string, unknown>
): PendingMutation {
  const mutation: PendingMutation = {
    id: crypto.randomUUID(),
    table,
    operation,
    payload,
    created_at: new Date().toISOString(),
    retries: 0,
  }
  const queue = getQueue()
  queue.push(mutation)
  saveQueue(queue)
  return mutation
}

export function dequeue(id: string): void {
  const queue = getQueue().filter((m) => m.id !== id)
  saveQueue(queue)
}

export function incrementRetry(id: string): void {
  const queue = getQueue().map((m) =>
    m.id === id ? { ...m, retries: m.retries + 1 } : m
  )
  saveQueue(queue)
}
