'use client'

import { useState } from 'react'
import { useInboxStore } from '@/stores/inboxStore'

export default function InboxInput() {
  const [text, setText] = useState('')
  const addEntry = useInboxStore((state) => state.addEntry)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addEntry(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que precisa ser feito?"
        className="w-full rounded-xl border border-gray-200 p-4 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white active:bg-indigo-700 disabled:opacity-50"
      >
        Capturar
      </button>
    </form>
  )
}
