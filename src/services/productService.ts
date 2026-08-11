import { api } from '@/lib/axios'
import type { Product, ProductFilterParams, PaginatedResponse, ApiResponse } from '@/types'
import { MOCK_PRODUCTS } from './mockData'

export const productService = {
  // Get products with filters, instant search, and pagination
  async getProducts(params: ProductFilterParams): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params })
      return response.data.data
    } catch {
      // Robust Mock Fallback for local demo
      let filtered = [...MOCK_PRODUCTS]

      if (params.search) {
        const query = params.search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        )
      }

      if (params.category) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase())
      }

      if (params.gender) {
        filtered = filtered.filter((p) => p.gender === params.gender || p.gender === 'unissex')
      }

      if (params.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= (params.minPrice || 0))
      }

      if (params.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= (params.maxPrice || Infinity))
      }

      if (params.sortBy) {
        if (params.sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price)
        if (params.sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price)
        if (params.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 6
      const start = (page - 1) * pageSize
      const items = filtered.slice(start, start + pageSize)

      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      }
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`)
      return response.data.data
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id)
      if (found) return found
      throw new Error('Produto não encontrado.')
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/products/featured')
      return response.data.data
    } catch {
      return MOCK_PRODUCTS.filter((p) => p.featured)
    }
  },
}
