import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Heart, ShoppingBag, Star } from 'lucide-react'
import { useWishlistStore } from '@/features/wishlist/store/useWishlistStore'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { useToast } from '@/contexts/ToastContext'

export const HomePage: React.FC = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(),
  })

  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addItem } = useCartStore()
  const { addToast } = useToast()

  const categories = [
    { title: 'Jaquetas & Agasalhos', tag: 'jaquetas', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800' },
    { title: 'Tênis Urbanos', tag: 'tenis', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { title: 'Camisetas Minimalistas', tag: 'camisas', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800' },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-slate-900/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
          alt="E-commerce Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-2xl space-y-6">
          <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Coleção Outono/Inverno 2026
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Design Minimalista.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
              Desempenho Incomparável.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Descubra vestuário e calçados desenvolvidos com tecidos tecnológicos premium. 
            Uma experiência de compra ultra rápida, fluida e totalmente segura.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Ver Catálogo Completo
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Checkout 100% Protegido no Backend</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categorias em Destaque</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore os itens mais desejados da temporada</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/products?category=${cat.tag}`}>
              <motion.div
                whileHover={{ y: -6 }}
                className="relative h-64 rounded-3xl overflow-hidden group shadow-lg cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-bold text-white mb-1">{cat.title}</h3>
                  <span className="text-xs text-indigo-300 font-medium flex items-center gap-1 group-hover:underline">
                    Explorar produtos <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lançamentos Recomendados</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Peças exclusivas selecionadas para você</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.map((product) => {
              const inFav = isInWishlist(product.id)
              return (
                <Card key={product.id} hoverEffect className="flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={() => {
                        toggleWishlist(product)
                        addToast({
                          type: 'info',
                          message: inFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
                        })
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${inFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {product.isNew && (
                      <Badge variant="primary" className="absolute top-3 left-3">
                        NOVO
                      </Badge>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<ShoppingBag className="w-4 h-4" />}
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
                          addToast({ type: 'success', message: 'Item adicionado ao carrinho!' })
                        }}
                      >
                        Comprar
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
