export interface Product {
  id: string
  name: string
  sku: string | null
  price: number | null
  stock_quantity: number
  min_stock: number
  category: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}
