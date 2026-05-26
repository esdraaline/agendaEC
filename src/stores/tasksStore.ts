import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Task } from '@/types/task'
import { useQueueStore } from './queueStore'
import { supabase } from '@/lib/supabase'

interface TasksState {
  tasks: Task[]
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  toggleTask: (id: string) => void
  fetchFromRemote: (storeId: string) => Promise<void>
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
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
      fetchFromRemote: async (storeId: string) => {
        if (get().tasks.length > 0) return

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('store_id', storeId)
        
        if (error) {
          console.error('[Sync] Erro ao buscar tasks:', error)
          return
        }

        if (data && data.length > 0) {
          set({ tasks: data as Task[] })
          console.debug('[Sync] tasks recuperados do Supabase:', data.length)
        }
      }
    }),
    {
      name: 'agendaec-tasks',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
