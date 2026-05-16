import { InboxEntry } from '@/types/inbox'
import { Task } from '@/types/task'
import { normalizeInput } from './normalize-input'
import { extractDate } from './extract-date'
import { extractPriority } from './extract-priority'
import { buildTask } from './build-task'

export function parseEntry(entry: InboxEntry): Task {
  console.debug('[Parser] Parsing entry', entry)
  const normalized = normalizeInput(entry.raw_text)
  const date = extractDate(normalized)
  const priority = extractPriority(normalized)
  return buildTask(entry.raw_text, date, priority)
}
