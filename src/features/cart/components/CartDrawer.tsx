import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ShieldCheck, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getEstimatedTotal, getItemCount } =
    useCartStore()
  const navigate = useNavigate()

  const total = getEstimatedTotal()
  const count = getItemCount()

  const handleCheckout = () => {
    closeCart()
    navigate('/cart')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Seu Carrinho</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{count} {count === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Fechar carrinho"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Seu carrinho está vazio</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      Navegue pelo nosso catálogo de roupas e calçados e adicione seus itens favoritos.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => { closeCart(); navigate('/products') }} className="mt-6">
                      Explorar Produtos
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {item.productName}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remover item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Tam: <span className="font-medium text-slate-700 dark:text-slate-300">{item.size}</span> | Cor: <span className="font-medium text-slate-700 dark:text-slate-300">{item.color}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.price * item.quantity)}
                          </span>

                          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-900">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Subtotal estimado</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(total)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Checkout 100% seguro com criptografia de dados.</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Ir para Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
