'use client'

import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  hideNav?: boolean
}

export default function Layout({ children, hideNav }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
