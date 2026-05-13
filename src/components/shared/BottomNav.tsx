'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Inbox, Settings } from 'lucide-react'

const links = [
  { href: '/hoje', label: 'Hoje', icon: Home },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/configuracoes', label: 'Config', icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                active ? 'text-violet-600' : 'text-gray-500'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
