import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Trash2, Plus, Minus, ShieldCheck, Ticket, ArrowRight, ShoppingBag } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { orderService } from '@/services/orderService'

const checkoutSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ser a sigla com 2 letras (ex: SP)'),
  zipCode: z.string().min(8, 'CEP é obrigatório'),
  paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO']),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getEstimatedTotal } = useCartStore()
  const [coupon, setCoupon] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      paymentMethod: 'PIX',
    },
  })

  const subtotal = getEstimatedTotal()

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return

    setIsSubmitting(true)
    try {
      const order = await orderService.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        paymentMethod: data.paymentMethod,
        couponCode: coupon || undefined,
      })

      clearCart()
      addToast({
        type: 'success',
        title: 'Pedido Processado!',
        message: `Pedido #${order.orderNumber} gerado com sucesso. Validação concluída no servidor.`,
      })
      navigate('/orders')
    } catch {
      // Axios interceptor handles error message
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Seu carrinho de compras está vazio</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Navegue pelas nossas seções de roupas e calçados e adicione seus produtos preferidos.
        </p>
        <Link to="/products">
          <Button variant="primary" className="mt-4">
            Explorar Produtos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Checkout & Resumo do Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Itens Selecionados ({items.length})</h3>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{item.productName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tam: {item.size} | Cor: {item.color}</p>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-slate-500">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-slate-500">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping & Payment Form */}
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Endereço de Entrega & Pagamento</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="CEP" error={errors.zipCode?.message} {...register('zipCode')} />
                  <Input label="Rua" containerClassName="sm:col-span-2" error={errors.street?.message} {...register('street')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Número" error={errors.number?.message} {...register('number')} />
                  <Input label="Complemento" {...register('complement')} />
                  <Input label="Bairro" error={errors.neighborhood?.message} {...register('neighborhood')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Cidade" containerClassName="sm:col-span-2" error={errors.city?.message} {...register('city')} />
                  <Input label="Estado (UF)" error={errors.state?.message} maxLength={2} {...register('state')} />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'PIX', label: 'PIX (Instântaneo)' },
                      { id: 'CREDIT_CARD', label: 'Cartão de Crédito' },
                      { id: 'BOLETO', label: 'Boleto Bancário' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold"
                      >
                        <input type="radio" value={method.id} {...register('paymentMethod')} className="accent-indigo-600" />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Resumo de Valores</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {/* Coupon input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Cupom (ex: BEMVINDO10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  leftIcon={<Ticket className="w-4 h-4" />}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Frete</span>
                <span className="font-semibold text-emerald-600">Grátis</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-lg font-black">
                <span>Total Estimado</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(subtotal)}</span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Finalizar Pedido
              </Button>
            </CardContent>
          </Card>

          {/* Security Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Processamento Seguro do Servidor</span>
            </div>
            <p className="leading-relaxed">
              O valor total final, a aplicabilidade de cupons e a reserva de estoque do carrinho são autorizados e recalculados estritamente pela API backend. Nenhuma alteração client-side de preço ou quantidade afeta o valor real cobrado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
