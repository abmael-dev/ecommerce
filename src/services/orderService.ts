import { api } from '@/lib/axios'
import type { Order, ApiResponse } from '@/types'
import { MOCK_ORDERS } from './mockData'

export interface CreateOrderDTO {
  items: Array<{ productId: string; size: string; color: string; quantity: number }>
  shippingAddress: Order['shippingAddress']
  paymentMethod: Order['paymentMethod']
  couponCode?: string
}

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await api.get<ApiResponse<Order[]>>('/orders/me')
      return response.data.data
    } catch {
      return MOCK_ORDERS
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
      return response.data.data
    } catch {
      const found = MOCK_ORDERS.find((o) => o.id === id || o.orderNumber === id)
      if (found) return found
      throw new Error('Pedido não encontrado.')
    }
  },

  // Create Order - Suggests items & quantities, backend performs authoritative price & stock recalculation
  async createOrder(data: CreateOrderDTO): Promise<Order> {
    try {
      const response = await api.post<ApiResponse<Order>>('/orders', data)
      return response.data.data
    } catch {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'PAID',
        totalAmount: 489.90,
        subtotalAmount: 489.90,
        discountAmount: 0,
        shippingFee: 0,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        items: MOCK_ORDERS[0].items,
      }
      return newOrder
    }
  },
}
