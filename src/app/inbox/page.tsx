'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useInboxStore } from '@/stores/inboxStore'
import { useTasksStore } from '@/stores/tasksStore'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import InboxInput from './components/InboxInput'
import InboxList from './components/InboxList'
import TaskList from './components/TaskList'

export default function InboxPage() {
  const { loading } = useRequireAuth()
  const [view, setView] = useState<'inbox' | 'tasks'>('inbox')
  
  const inboxCount = useInboxStore((state) => state.entries.filter(e => !e.processed).length)
  const taskCount = useTasksStore((state) => state.tasks.filter(t => !t.completed).length)

  if (loading) return <FullPageSpinner />

  return (
    <Layout>
      <div className="pb-24">
        <header className="sticky top-0 z-10 border-b bg-white/80 px-4 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Inbox</h1>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setView('inbox')}
              className={`relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                view === 'inbox' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              Captura
              {inboxCount > 0 && (
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                  view === 'inbox' ? 'bg-indigo-400 text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                  {inboxCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                view === 'tasks' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              Tarefas
              {taskCount > 0 && (
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                  view === 'tasks' ? 'bg-indigo-400 text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                  {taskCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="p-4">
          {view === 'inbox' ? (
            <div className="flex flex-col gap-6">
              <InboxInput />
              <InboxList />
            </div>
          ) : (
            <TaskList />
          )}
        </div>
      </div>
    </Layout>
  )
}
