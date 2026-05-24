export interface Appointment {
  id: string
  client_id: string | null
  title: string
  date: string
  time: string | null
  notes: string | null
  notified_wa: boolean
  created_at: string
  updated_at: string
}
