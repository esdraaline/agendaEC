import { InboxEntry } from '@/types/inbox'
import { Task } from '@/types/task'
import { Sale } from '@/types/sale'
import { normalizeInput } from './normalize-input'
import { extractDate } from './extract-date'
import { extractPriority } from './extract-priority'
import { extractAmount } from './extract-amount'
import { buildTask } from './build-task'
import { buildSale } from './build-sale'

export type ParsedResult = 
  | { type: 'task'; data: Task }
  | { type: 'sale'; data: Sale }

export function parseEntry(entry: InboxEntry): ParsedResult {
  console.debug('[Parser] Parsing entry', entry)
  const normalized = normalizeInput(entry.raw_text)
  const date = extractDate(normalized)
  const amount = extractAmount(normalized)

  if (amount !== null) {
    return {
      type: 'sale',
      data: buildSale(entry.raw_text, date, amount)
    }
  }

  const priority = extractPriority(normalized)
  return {
    type: 'task',
    data: buildTask(entry.raw_text, date, priority)
  }
}
