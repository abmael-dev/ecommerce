import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import type { ProductFilterParams } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { formatCurrency } from '@/lib/utils'
import { Filter, Search, X, Heart, ShoppingBag, Star, RefreshCw } from 'lucide-react'
import { useWishlistStore } from '@/features/wishlist/store/useWishlistStore'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { useToast } from '@/contexts/ToastContext'

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [gender, setGender] = useState(searchParams.get('gender') || '')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest')
  const [page, setPage] = useState(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addItem } = useCartStore()
  const { addToast } = useToast()

  const filterParams: ProductFilterParams = {
    search: debouncedSearch,
    category: category || undefined,
    gender: gender || undefined,
    minPrice,
    maxPrice,
    sortBy,
    page,
    pageSize: 6,
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', filterParams],
    queryFn: () => productService.getProducts(filterParams),
  })

  const resetFilters = () => {
    setSearchTerm('')
    setCategory('')
    setGender('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setSortBy('newest')
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Instant Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Catálogo de Produtos</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {data ? `${data.total} produtos encontrados` : 'Carregando opções...'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Instant Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Input
              type="text"
              placeholder="Pesquisa rápida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={[
              { value: 'newest', label: 'Mais Recentes' },
              { value: 'price_asc', label: 'Menor Preço' },
              { value: 'price_desc', label: 'Maior Preço' },
              { value: 'rating', label: 'Melhor Avaliados' },
            ]}
            className="w-44"
          />

          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setIsMobileFilterOpen(true)}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" /> Filtros
              </h3>
              <button onClick={resetFilters} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Limpar
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Categoria
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: '', label: 'Todas as Categorias' },
                  { value: 'jaquetas', label: 'Jaquetas' },
                  { value: 'camisas', label: 'Camisetas' },
                  { value: 'calcas', label: 'Calças' },
                  { value: 'tenis', label: 'Tênis' },
                  { value: 'acessorios', label: 'Acessórios' },
                ]}
              />
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Gênero
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: '', label: 'Todos' },
                  { id: 'masculino', label: 'Masculino' },
                  { id: 'feminino', label: 'Feminino' },
                  { id: 'unissex', label: 'Unissex' },
                ].map((g) => (
                  <label key={g.id} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g.id}
                      onChange={() => setGender(g.id)}
                      className="accent-indigo-600"
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Faixa de Preço (R$)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice ?? ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice ?? ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Nenhum produto encontrado</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Tente ajustar seus termos de pesquisa ou remover os filtros aplicados.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items.map((product) => {
                const inFav = isInWishlist(product.id)
                return (
                  <Card key={product.id} hoverEffect className="flex flex-col justify-between">
                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />

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
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-base font-black text-slate-900 dark:text-slate-100">
                            {formatCurrency(product.price)}
                          </span>
                        </div>

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
                            addToast({ type: 'success', message: 'Item adicionado ao carrinho!' })
                          }}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filtros"
        maxWidth="xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Categoria
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: '', label: 'Todas as Categorias' },
                { value: 'jaquetas', label: 'Jaquetas' },
                { value: 'camisas', label: 'Camisetas' },
                { value: 'calcas', label: 'Calças' },
                { value: 'tenis', label: 'Tênis' },
                { value: 'acessorios', label: 'Acessórios' },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Gênero
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: '', label: 'Todos' },
                { id: 'masculino', label: 'Masculino' },
                { id: 'feminino', label: 'Feminino' },
                { id: 'unissex', label: 'Unissex' },
              ].map((g) => (
                <label key={g.id} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === g.id}
                    onChange={() => setGender(g.id)}
                    className="accent-indigo-600"
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Faixa de Preço (R$)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice ?? ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                type="number"
                placeholder="Máx"
                value={maxPrice ?? ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => { resetFilters(); setIsMobileFilterOpen(false) }}>
              Limpar
            </Button>
            <Button variant="primary" onClick={() => setIsMobileFilterOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
