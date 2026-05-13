'use client'

import { Plus } from 'lucide-react'

interface FABProps {
  onClick: () => void
  label?: string
}

export default function FAB({ onClick, label = 'Novo registro' }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-20 right-4 bg-violet-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform"
    >
      <Plus size={28} />
    </button>
  )
}
