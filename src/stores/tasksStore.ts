import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Task } from '@/types/task'
import { useQueueStore } from './queueStore'

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
      addTask: (task) => {
        set((state) => ({
          tasks: [task, ...state.tasks],
        }))

        console.debug('[Tasks] Task added', task)

        useQueueStore.getState().enqueue({
          type: 'task_create',
          entityId: task.id,
          payload: task,
        })
      },
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))

        console.debug('[Tasks] Task removed', id)

        useQueueStore.getState().enqueue({
          type: 'task_delete',
          entityId: id,
          payload: null,
        })
      },
      toggleTask: (id) => {
        let updatedTask: Task | undefined

        set((state) => {
          const newTasks = state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
          updatedTask = newTasks.find((t) => t.id === id)
          return {
            tasks: newTasks,
          }
        })

        console.debug('[Tasks] Task toggled', id)

        if (updatedTask) {
          useQueueStore.getState().enqueue({
            type: 'task_update',
            entityId: id,
            payload: { completed: updatedTask.completed },
          })
        }
      },
    }),
    {
      name: 'agendaec-tasks',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
