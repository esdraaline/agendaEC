import { Sale } from '@/types/sale'

export function buildSale(raw_text: string, date: string | null, amount: number): Sale {
  // Simple extraction of description: everything except the amount and date keywords
  let description = raw_text
    .replace(/(?:r\$?\s*)?(\d+(?:[.,]\d{2})?)/i, '')
    .replace(/hoje|amanha|amanhã|segunda|terca|terça|quarta|quinta|sexta|sabado|sábado|domingo/gi, '')
    .replace(/\d{1,2}\/\d{1,2}/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!description) description = 'Venda sem descrição'

  const now = new Date().toISOString()
  
  const sale: Sale = {
    id: crypto.randomUUID(),
    client_id: null, // To be implemented later with client detection
    entry_id: null,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    total_amount: amount,
    paid_amount: amount, // Assume fully paid by default for MVP simplicity
    status: 'confirmed',
    notes: `Capturado via Inbox: "${raw_text}"`,
    origin: 'manual',
    sale_date: date || new Date().toISOString().split('T')[0],
    deleted_at: null,
    created_at: now,
    updated_at: now,
  }

  console.debug('[Parser] Sale built', sale)
  return sale
}
