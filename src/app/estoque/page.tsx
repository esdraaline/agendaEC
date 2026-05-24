'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import Layout from '@/components/shared/Layout'
import FullPageSpinner from '@/components/shared/FullPageSpinner'
import { useInventoryStore } from '@/stores/inventoryStore'
import { Plus, Package, AlertTriangle, Minus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EstoquePage() {
  const { loading } = useRequireAuth()
  const { products, addProduct, adjustStock } = useInventoryStore()
  
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const minStock = '5'
  const [search, setSearch] = useState('')

  if (loading) return <FullPageSpinner />

  const activeProducts = products.filter(p => !p.deleted_at)
  
  const filteredProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name))

  const lowStockCount = activeProducts.filter(p => p.stock_quantity <= p.min_stock).length

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addProduct({
      id: crypto.randomUUID(),
      name: name.trim(),
      sku: null,
      price: price ? parseFloat(price.replace(',', '.')) : null,
      stock_quantity: parseInt(stock) || 0,
      min_stock: parseInt(minStock) || 0,
      category: null,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    setName('')
    setPrice('')
    setStock('')
    setIsAdding(false)
  }

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Estoque</h1>
            <p className="text-sm text-gray-500">Gerencie seus produtos</p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-black text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        {lowStockCount > 0 && !isAdding && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-red-800">Atenção ao Estoque</p>
              <p className="text-xs text-red-600 mt-0.5">
                Você tem {lowStockCount} {lowStockCount === 1 ? 'produto' : 'produtos'} com estoque baixo.
              </p>
            </div>
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4 animate-in slide-in-from-top-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} /> Novo Produto
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Nome do Produto</label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                placeholder="Ex: Kit Shampoo Matizador"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Qtd Atual</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Preço (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-900 text-white">
                Salvar
              </Button>
            </div>
          </form>
        )}

        {!isAdding && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
            placeholder="Buscar produto..."
          />
        )}

        <div className="space-y-3">
          {filteredProducts.map(p => {
            const isLow = p.stock_quantity <= p.min_stock
            
            return (
              <div key={p.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3 ${isLow ? 'border-red-200' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {p.price ? `R$ ${p.price.toFixed(2).replace('.', ',')}` : 'Sem preço'}
                    </p>
                  </div>
                  <button className="text-gray-400 p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    {isLow && <AlertTriangle size={14} className="text-red-500" />}
                    <span className={`text-sm font-medium ${isLow ? 'text-red-600' : 'text-gray-600'}`}>
                      {p.stock_quantity} em estoque
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => adjustStock(p.id, -1)}
                      className="p-1.5 bg-white rounded-md shadow-sm active:scale-95 text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{p.stock_quantity}</span>
                    <button 
                      onClick={() => adjustStock(p.id, 1)}
                      className="p-1.5 bg-white rounded-md shadow-sm active:scale-95 text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {!isAdding && activeProducts.length === 0 && (
            <div className="text-center py-10">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">Seu estoque está vazio</p>
              <p className="text-sm text-gray-400 mt-1">Adicione seu primeiro produto clicando no +</p>
            </div>
          )}
          
          {!isAdding && activeProducts.length > 0 && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-10">Nenhum produto encontrado para &quot;{search}&quot;.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}
