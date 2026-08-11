import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/orderService'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShoppingBag, Truck, CheckCircle2 } from 'lucide-react'

export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="success">Entregue</Badge>
      case 'SHIPPED':
        return <Badge variant="info">Em Transporte</Badge>
      case 'PAID':
        return <Badge variant="primary">Pago</Badge>
      case 'PENDING':
        return <Badge variant="warning">Aguardando Pagamento</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Meus Pedidos</h1>
          <p className="text-xs text-slate-500 mt-1">Acompanhe a entrega dos seus produtos</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : orders?.length === 0 ? (
        <Card className="text-center p-12">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold">Nenhum pedido realizado ainda</h3>
          <p className="text-xs text-slate-500 mt-1">Realize sua primeira compra para acompanhar o rastreio aqui.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-slate-500">Realizado em {formatDate(order.createdAt)}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total do Pedido</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Tracking Progress */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-850 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {order.status === 'DELIVERED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Truck className="w-4 h-4 text-indigo-500 animate-pulse" />
                    )}
                    <span>
                      {order.status === 'DELIVERED' ? 'Pedido Entregue com Sucesso' : 'Em processamento pelo centro logístico'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{order.paymentMethod}</span>
                </div>

                {/* Items preview */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.productName}</p>
                          <span className="text-slate-500">Qtd: {item.quantity} | Tam: {item.size}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
