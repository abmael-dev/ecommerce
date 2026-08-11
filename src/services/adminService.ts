import { api } from '@/lib/axios'
import type { AdminDashboardMetrics, Product, Category, Brand, Coupon, Order, User, ApiResponse } from '@/types'
import { MOCK_METRICS, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS, MOCK_COUPONS, MOCK_ORDERS, MOCK_USERS } from './mockData'

export const adminService = {
  async getMetrics(): Promise<AdminDashboardMetrics> {
    try {
      const response = await api.get<ApiResponse<AdminDashboardMetrics>>('/admin/metrics')
      return response.data.data
    } catch {
      return MOCK_METRICS
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/admin/products')
      return response.data.data
    } catch {
      return MOCK_PRODUCTS
    }
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post<ApiResponse<Product>>('/admin/products', data)
      return response.data.data
    } catch {
      const created: Product = {
        id: `prod-${Date.now()}`,
        name: data.name || 'Novo Produto',
        slug: (data.name || 'novo-produto').toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        price: data.price || 99.90,
        category: data.category || 'jaquetas',
        brand: data.brand || 'Urban Craft',
        gender: data.gender || 'unissex',
        images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'],
        rating: 5.0,
        reviewCount: 0,
        tags: data.tags || ['Novo'],
        variants: data.variants || [],
      }
      return created
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/admin/categories')
      return response.data.data
    } catch {
      return MOCK_CATEGORIES
    }
  },

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get<ApiResponse<Brand[]>>('/admin/brands')
      return response.data.data
    } catch {
      return MOCK_BRANDS
    }
  },

  async getCoupons(): Promise<Coupon[]> {
    try {
      const response = await api.get<ApiResponse<Coupon[]>>('/admin/coupons')
      return response.data.data
    } catch {
      return MOCK_COUPONS
    }
  },

  async getCustomers(): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>('/admin/customers')
      return response.data.data
    } catch {
      return MOCK_USERS
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get<ApiResponse<Order[]>>('/admin/orders')
      return response.data.data
    } catch {
      return MOCK_ORDERS
    }
  },
}
