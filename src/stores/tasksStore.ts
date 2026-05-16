import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Task } from '@/types/task'

interface TasksState {
  tasks: Task[]
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  toggleTask: (id: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => {
          console.debug('[Tasks] Task added', task)
          return {
            tasks: [task, ...state.tasks],
          }
        }),
      removeTask: (id) =>
        set((state) => {
          console.debug('[Tasks] Task removed', id)
          return {
            tasks: state.tasks.filter((t) => t.id !== id),
          }
        }),
      toggleTask: (id) =>
        set((state) => {
          console.debug('[Tasks] Task toggled', id)
          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
          }
        }),
    }),
    {
      name: 'agendaec-tasks',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
