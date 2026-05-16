'use client'

import { useInboxStore } from '@/stores/inboxStore'
import { useTasksStore } from '@/stores/tasksStore'
import { parseEntry } from '@/lib/ai/parseEntry'

export default function InboxList() {
  const entries = useInboxStore((state) => 
    state.entries
      .filter(e => !e.processed)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  )
  const markProcessed = useInboxStore((state) => state.markProcessed)
  const addTask = useTasksStore((state) => state.addTask)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-gray-100 p-3">
          <span className="text-2xl">📥</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900">Inbox vazia</h3>
        <p className="mt-1 text-xs text-gray-500">Capture seus pensamentos acima.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Aguardando Processamento</h2>
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm transition-all active:scale-[0.98]"
        >
          <p className="text-base leading-relaxed text-gray-800">{entry.raw_text}</p>
          <button
            onClick={() => {
              const task = parseEntry(entry)
              addTask(task)
              markProcessed(entry.id)
            }}
            className="self-end rounded-xl bg-indigo-50 px-5 py-2.5 text-sm font-bold text-indigo-700 active:bg-indigo-100 transition-colors"
          >
            Processar Agora
          </button>
        </div>
      ))}
    </div>
  )
}
