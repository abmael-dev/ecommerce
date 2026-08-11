import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '@/features/wishlist/store/useWishlistStore'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export const WishlistPage: React.FC = () => {
  const { items, toggleWishlist } = useWishlistStore()
  const { addItem } = useCartStore()
  const { addToast } = useToast()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sua lista de favoritos está vazia</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Guarde suas peças favoritas para acompanhar o estoque ou comprar mais tarde.
        </p>
        <Link to="/products">
          <Button variant="primary" className="mt-4">
            Explorar Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Meus Favoritos ({items.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <Card key={product.id} hoverEffect className="flex flex-col justify-between">
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  toggleWishlist(product)
                  addToast({ type: 'info', message: 'Item removido dos favoritos' })
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md text-red-500 hover:scale-110 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {product.brand}
              </span>
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100">
                  {formatCurrency(product.price)}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const firstVariant = product.variants[0]
                    addItem({
                      productId: product.id,
                      productName: product.name,
                      productImage: product.images[0],
                      productSlug: product.slug,
                      price: product.price,
                      size: firstVariant?.size || 'M',
                      color: firstVariant?.color || 'Preto',
                      quantity: 1,
                      maxStock: firstVariant?.stockQuantity || 10,
                    })
                    addToast({ type: 'success', message: 'Mover para o carrinho com sucesso!' })
                  }}
                >
                  Mover pro Carrinho
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
