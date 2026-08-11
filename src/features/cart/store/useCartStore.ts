import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  // UI Display calculations (Disclaimer: Backend recalculated on checkout)
  getItemCount: () => number
  getEstimatedTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        const currentItems = get().items
        const existingIndex = currentItems.findIndex(
          (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
        )

        if (existingIndex > -1) {
          const updated = [...currentItems]
          const existing = updated[existingIndex]
          const newQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock || 99)
          updated[existingIndex] = { ...existing, quantity: newQty }
          set({ items: updated, isOpen: true })
        } else {
          const id = `${newItem.productId}-${newItem.size}-${newItem.color}`
          set({ items: [...currentItems, { ...newItem, id }], isOpen: true })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getEstimatedTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'ecommerce-cart-state',
      partialize: (state) => ({ items: state.items }), // Store transient UI draft only
    }
  )
)
