import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminService.getMetrics(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  const kpis = [
    { label: 'Faturamento Total', value: formatCurrency(metrics?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'Pedidos Realizados', value: metrics?.totalOrders || 0, icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/60' },
    { label: 'Clientes Cadastrados', value: metrics?.totalCustomers || 0, icon: Users, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/60' },
    { label: 'Produtos no Catálogo', value: metrics?.totalProducts || 0, icon: Package, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Visão Geral do Negócio</h1>
        <p className="text-xs text-slate-500 mt-1">Métricas atualizadas em tempo real via API backend</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{kpi.label}</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">{kpi.value}</h3>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Últimos Pedidos</h3>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'DELIVERED' ? 'success' : 'primary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Warning */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Alerta de Estoque Baixo</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics?.lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{p.name}</h4>
                    <span className="text-[11px] text-amber-600 font-semibold">Reposição recomendada</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
