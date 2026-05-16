'use client'

import { useTasksStore } from '@/stores/tasksStore'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function TaskList() {
  const tasks = useTasksStore((state) => state.tasks)
  const toggleTask = useTasksStore((state) => state.toggleTask)
  const removeTask = useTasksStore((state) => state.removeTask)

  // Ordenação: incompletas primeiro, depois por data de criação desc
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-gray-100 p-3">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900">Tudo em dia</h3>
        <p className="mt-1 text-xs text-gray-500">Nenhuma tarefa pendente no momento.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Minhas Tarefas</h2>
      {sortedTasks.map((task) => (
        <div 
          key={task.id} 
          className={`group relative flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all ${
            task.completed ? 'bg-gray-50/50 opacity-75' : ''
          }`}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all active:scale-125"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-base font-semibold leading-snug break-words ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {task.due_date && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                  📅 {format(parseISO(task.due_date), "dd 'de' MMM", { locale: ptBR })}
                </span>
              )}
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                task.priority === 'low' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baixa' : 'Normal'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('Deseja remover esta tarefa?')) {
                removeTask(task.id)
              }
            }}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      ))}
    </div>
  )
}
