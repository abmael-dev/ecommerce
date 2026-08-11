// Generic API Envelope
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// User & Auth Types
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  createdAt: string
}

// Product Types
export type ProductCategory = 'ropa' | 'calcados' | 'acessorios' | 'camisas' | 'calcas' | 'jaquetas' | 'tenis'
export type ProductGender = 'masculino' | 'feminino' | 'unissex' | 'infantil'

export interface ProductVariant {
  id: string
  sku: string
  size: string
  color: string
  colorHex?: string
  stockQuantity: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number // Display only (suggested value; backend recalculates)
  originalPrice?: number
  category: ProductCategory
  brand: string
  gender: ProductGender
  images: string[]
  featured?: boolean
  rating: number
  reviewCount: number
  variants: ProductVariant[]
  tags: string[]
  isNew?: boolean
}

export interface ProductFilterParams {
  search?: string
  category?: string
  brand?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating'
  page?: number
  pageSize?: number
}

// Cart Item Interface (Frontend representation - suggested quantity & variant)
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productSlug: string
  price: number
  size: string
  color: string
  quantity: number
  maxStock: number
}

// Order Types
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  size: string
  color: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: OrderStatus
  totalAmount: number
  subtotalAmount: number
  discountAmount: number
  shippingFee: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: 'CREDIT_CARD' | 'PIX' | 'BOLETO'
}

// Admin Specific Types
export interface Brand {
  id: string
  name: string
  logoUrl?: string
  productCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  productCount: number
}

export interface Coupon {
  id: string
  code: string
  discountPercentage: number
  maxDiscount?: number
  minPurchaseAmount?: number
  expiresAt: string
  active: boolean
  usageCount: number
}

export interface AdminDashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: Order[]
  lowStockProducts: Product[]
}
