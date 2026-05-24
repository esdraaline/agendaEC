'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useTemplatesStore } from '@/stores/templatesStore'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Trash2, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { Template } from '@/types/template'

export default function TemplatesPage() {
  const { loading } = useRequireAuth()
  const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplatesStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  if (loading) return <FullPageSpinner />

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    if (editingId) {
      updateTemplate(editingId, { name: name.trim(), content: content.trim() })
    } else {
      addTemplate({ name: name.trim(), content: content.trim() })
    }

    closeEditor()
  }

  const openEditor = (template?: Template) => {
    if (template) {
      setEditingId(template.id)
      setName(template.name)
      setContent(template.content)
    } else {
      setEditingId(null)
      setName('')
      setContent('')
    }
    setIsEditing(true)
  }

  const closeEditor = () => {
    setIsEditing(false)
    setEditingId(null)
    setName('')
    setContent('')
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/configuracoes" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} className="text-gray-900" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Templates</h1>
            <p className="text-sm text-gray-500">Mensagens do WhatsApp</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="font-semibold">{editingId ? 'Editar Template' : 'Novo Template'}</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Nome do Template</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                placeholder="Ex: Cobrança Atrasada"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-gray-400">Mensagem</label>
                <span className="text-[10px] text-gray-400">Variáveis: {'{nome}'}, {'{saldo}'}</span>
              </div>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                placeholder="Olá {nome}, seu saldo é {saldo}."
              />
              <p className="text-xs text-gray-500">
                Você pode usar {'{nome}'} para o nome do cliente e {'{saldo}'} para o valor devido.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={closeEditor}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditor(template)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Excluir este template?')) {
                            removeTemplate(template.id)
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                </div>
              ))}

              {templates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Nenhum template cadastrado.</p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => openEditor()}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Criar Template
            </Button>
          </>
        )}
      </div>
    </Layout>
  )
}
