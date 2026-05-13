'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { enqueue } from '@/lib/offline/queue'

export default function InboxForm() {
  const searchParams = useSearchParams()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const shared = searchParams.get('shared')
    if (shared) setText(decodeURIComponent(shared))
  }, [searchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    enqueue('entries', 'insert', {
      id: crypto.randomUUID(),
      raw_text: text.trim(),
      origin: 'manual',
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    setText('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    textareaRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite ou cole aqui... Ex: Renata 6 tintas quinta 150 entrada"
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[120px] resize-none"
        autoFocus
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full rounded-xl bg-violet-600 py-3 text-base font-semibold text-white disabled:opacity-40 active:scale-[0.98] transition-transform"
      >
        {saved ? 'Salvo!' : 'Salvar'}
      </button>
    </form>
  )
}
