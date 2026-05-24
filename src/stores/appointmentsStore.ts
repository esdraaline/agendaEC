import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Appointment } from '@/types/appointment'
import { useQueueStore } from './queueStore'

interface AppointmentsState {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  removeAppointment: (id: string) => void
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appointment) => {
        set((state) => ({
          appointments: [appointment, ...state.appointments],
        }))
        useQueueStore.getState().enqueue({
          type: 'appointment_create',
          entityId: appointment.id,
          payload: appointment,
        })
      },
      updateAppointment: (id, updates) => {
        let updatedAppointment: Appointment | undefined
        set((state) => {
          const newAppointments = state.appointments.map((a) => {
            if (a.id !== id) return a
            updatedAppointment = { ...a, ...updates, updated_at: new Date().toISOString() }
            return updatedAppointment
          })
          return { appointments: newAppointments }
        })
        if (updatedAppointment) {
          useQueueStore.getState().enqueue({
            type: 'appointment_update',
            entityId: id,
            payload: updatedAppointment,
          })
        }
      },
      removeAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }))
        useQueueStore.getState().enqueue({
          type: 'appointment_delete',
          entityId: id,
          payload: { deleted_at: new Date().toISOString() }, // Emulando um soft delete na sync
        })
      },
    }),
    {
      name: 'agendaec-appointments',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
