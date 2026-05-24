import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Template } from '@/types/template'

interface TemplatesState {
  templates: Template[]
  addTemplate: (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => void
  updateTemplate: (id: string, updates: Partial<Template>) => void
  removeTemplate: (id: string) => void
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'default-billing',
    name: 'Cobrança Padrão',
    content: 'Olá {nome}! Tudo bem? Passando para lembrar que você tem um saldo pendente de {saldo} na lojinha. Podemos acertar essa semana?',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set) => ({
      templates: DEFAULT_TEMPLATES,
      addTemplate: (template) => {
        const newTemplate: Template = {
          ...template,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({
          templates: [newTemplate, ...state.templates],
        }))
      },
      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? { ...t, ...updates, updated_at: new Date().toISOString() }
              : t
          ),
        }))
      },
      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }))
      },
    }),
    {
      name: 'agendaec-templates',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
