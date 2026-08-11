import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export const AdminOrdersPage: React.FC = () => {
  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminService.getOrders(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gerenciamento de Pedidos</h1>
        <p className="text-xs text-slate-500 mt-1">Acompanhe todos os pedidos efetuados no e-commerce</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número do Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">{o.orderNumber}</TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell><Badge variant="neutral">{o.paymentMethod}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={o.status === 'DELIVERED' ? 'success' : 'primary'}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(o.totalAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
