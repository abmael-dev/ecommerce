import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, Heart, ShieldCheck, Star, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { useWishlistStore } from '@/features/wishlist/store/useWishlistStore'
import { useToast } from '@/contexts/ToastContext'

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const quantity = 1

  const { addItem } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addToast } = useToast()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id || ''),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-bold">Produto não encontrado</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Voltar para produtos
        </Button>
      </div>
    )
  }

  const inFav = isInWishlist(product.id)
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)))
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)))

  const activeSize = selectedSize || availableSizes[0] || 'M'
  const activeColor = selectedColor || availableColors[0] || 'Preto'

  const activeVariant = product.variants.find(
    (v) => v.size === activeSize && v.color === activeColor
  ) || product.variants[0]

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      productSlug: product.slug,
      price: product.price,
      size: activeSize,
      color: activeColor,
      quantity,
      maxStock: activeVariant?.stockQuantity || 10,
    })
    addToast({ type: 'success', message: 'Item adicionado ao carrinho com sucesso!' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="primary">{product.brand}</Badge>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{product.rating} ({product.reviewCount} avaliações)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-3">
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tamanho Selecionado: <span className="text-indigo-600 font-bold">{activeSize}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    activeSize === sz
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Cor Selecionada: <span className="text-indigo-600 font-bold">{activeColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((cl) => (
                <button
                  key={cl}
                  onClick={() => setSelectedColor(cl)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    activeColor === cl
                      ? 'border-indigo-600 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cl}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Notice */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Em estoque ({activeVariant?.stockQuantity || 10} unidades disponíveis)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                toggleWishlist(product)
                addToast({
                  type: 'info',
                  message: inFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
                })
              }}
            >
              <Heart className={`w-5 h-5 ${inFav ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Security Disclaimer Banner */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Garantia de Integridade:</strong> Preços, variantes de estoque e cupons selecionados no frontend servem como sugestão inicial e são auditados e recalculados obrigatoriamente pela API antes da finalização do pedido.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
