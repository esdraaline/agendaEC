import { supabase } from '@/lib/supabase'
import { useQueueStore } from '@/stores/queueStore'
import { useContextStore } from '@/stores/contextStore'
import { useAuthStore } from '@/stores/authStore'
import { PendingMutation } from '@/types/sync'

export async function syncPendingMutations() {
  const queue = useQueueStore.getState()
  const context = useContextStore.getState()
  const auth = useAuthStore.getState()

  return runSync({
    mutations: queue.mutations,
    markSynced: queue.markSynced,
    clearSynced: queue.clearSynced,
    storeId: context.store?.id,
    userId: auth.user?.id,
  })
}

interface SyncOptions {
  mutations: PendingMutation[]
  markSynced: (id: string) => void
  clearSynced: () => void
  storeId?: string
  userId?: string
}

async function runSync({ mutations, markSynced, clearSynced, storeId, userId }: SyncOptions) {
  if (!storeId) {
    console.debug('[SyncEngine] No store context found, skipping sync')
    return
  }

  const pending = mutations.filter((m) => !m.synced)
  console.debug(`[SyncEngine] Starting sync for ${pending.length} mutations`)

  for (const mutation of pending) {
    try {
      await processMutation(mutation, storeId, userId)
      markSynced(mutation.id)
      console.debug(`[SyncEngine] Successfully synced mutation ${mutation.id}`)
    } catch (error) {
      console.debug(`[SyncEngine] Error syncing mutation ${mutation.id}:`, error)
      break // Stop at first error
    }
  }

  clearSynced()
  console.debug('[SyncEngine] Sync cycle completed')
}

async function processMutation(mutation: PendingMutation, storeId: string, userId?: string) {
  switch (mutation.type) {
    case 'task_create':
      const payload = mutation.payload as any
      const { error: createError } = await supabase
        .from('tasks')
        .insert({
          id: payload.id,
          store_id: storeId,
          created_by: userId,
          title: payload.title,
          priority: payload.priority,
          due_date: payload.due_date,
          completed: payload.completed,
          created_at: payload.created_at,
        })
      if (createError) throw createError
      break

    case 'task_update':
      const { error: updateError } = await supabase
        .from('tasks')
        .update(mutation.payload as any)
        .eq('id', mutation.entityId)
      if (updateError) throw updateError
      break

    case 'task_delete':
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', mutation.entityId)
      if (deleteError) throw deleteError
      break

    default:
      console.debug(`[SyncEngine] Unknown mutation type: ${mutation.type}`)
  }
}
