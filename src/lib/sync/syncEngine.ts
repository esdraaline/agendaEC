import { supabase } from '@/lib/supabase'
import { useQueueStore } from '@/stores/queueStore'
import { useContextStore } from '@/stores/contextStore'
import { useAuthStore } from '@/stores/authStore'
import { PendingMutation } from '@/types/sync'
import { Task } from '@/types/task'
import { Sale } from '@/types/sale'
import { Client } from '@/types/client'
import { DailyClosing } from '@/types/dailyClosing'

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
    case 'task_create': {
      const payload = mutation.payload as Task
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
    }

    case 'task_update': {
      const { error: updateError } = await supabase
        .from('tasks')
        .update(mutation.payload as Partial<Task>)
        .eq('id', mutation.entityId)
      if (updateError) throw updateError
      break
    }

    case 'task_delete': {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', mutation.entityId)
      if (deleteError) throw deleteError
      break
    }

    case 'sale_create': {
      const payload = mutation.payload as Sale
      const { error: createError } = await supabase
        .from('sales')
        .insert({
          id: payload.id,
          store_id: storeId,
          client_id: payload.client_id,
          entry_id: payload.entry_id,
          description: payload.description,
          total_amount: payload.total_amount,
          paid_amount: payload.paid_amount,
          status: payload.status,
          payment_method: payload.payment_method,
          notes: payload.notes,
          origin: payload.origin,
          sale_date: payload.sale_date,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
        })
      if (createError) throw createError
      break
    }

    case 'sale_update': {
      const { error: updateError } = await supabase
        .from('sales')
        .update(mutation.payload as Partial<Sale>)
        .eq('id', mutation.entityId)
      if (updateError) throw updateError
      break
    }

    case 'sale_delete': {
      // DEC-010: Soft Delete Obrigatório
      const payload = mutation.payload as Partial<Sale>
      const { error: deleteError } = await supabase
        .from('sales')
        .update({ deleted_at: payload.deleted_at })
        .eq('id', mutation.entityId)
      if (deleteError) throw deleteError
      break
    }

    case 'client_create': {
      const payload = mutation.payload as Client
      const { error: createError } = await supabase
        .from('clients')
        .insert({
          id: payload.id,
          store_id: storeId,
          name: payload.name,
          phone: payload.phone,
          notes: payload.notes,
          balance: payload.balance,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
        })
      if (createError) throw createError
      break
    }

    case 'client_update': {
      const { error: updateError } = await supabase
        .from('clients')
        .update(mutation.payload as Partial<Client>)
        .eq('id', mutation.entityId)
      if (updateError) throw updateError
      break
    }

    case 'client_delete': {
      // DEC-010: Soft Delete Obrigatório
      const payload = mutation.payload as Partial<Client>
      const { error: deleteError } = await supabase
        .from('clients')
        .update({ deleted_at: payload.deleted_at })
        .eq('id', mutation.entityId)
      if (deleteError) throw deleteError
      break
    }

    case 'daily_closing_create': {
      const payload = mutation.payload as DailyClosing
      const { error: createError } = await supabase
        .from('daily_closings')
        .insert({
          id: payload.id,
          closing_date: payload.closing_date,
          total_sales: payload.total_sales,
          total_cash: payload.total_cash,
          total_pix: payload.total_pix,
          total_card: payload.total_card,
          total_fiado: payload.total_fiado,
          summary_data: payload.summary_data,
          confirmed: payload.confirmed,
          created_at: payload.created_at,
        })
      if (createError) throw createError
      break
    }

    default:
      console.debug(`[SyncEngine] Unknown mutation type: ${mutation.type}`)
  }
}
