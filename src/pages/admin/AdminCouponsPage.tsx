import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Ticket } from 'lucide-react'

export const AdminCouponsPage: React.FC = () => {
  const { data: coupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminService.getCoupons(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Cupons de Desconto</h1>
        <p className="text-xs text-slate-500 mt-1">Gerenciamento de campanhas promocionais</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código do Cupom</TableHead>
                <TableHead>Desconto (%)</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Usos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-indigo-600" />
                    <code className="text-indigo-600 font-bold">{c.code}</code>
                  </TableCell>
                  <TableCell className="font-bold">{c.discountPercentage}% OFF</TableCell>
                  <TableCell>{c.expiresAt}</TableCell>
                  <TableCell>
                    <Badge variant={c.active ? 'success' : 'danger'}>
                      {c.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{c.usageCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
