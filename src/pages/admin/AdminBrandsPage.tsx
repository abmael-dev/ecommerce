import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Tag } from 'lucide-react'

export const AdminBrandsPage: React.FC = () => {
  const { data: brands } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => adminService.getBrands(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Marcas Parceiras</h1>
        <p className="text-xs text-slate-500 mt-1">Marcas e fornecedores cadastrados na loja</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead className="text-right">Total de Produtos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-bold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>{b.name}</span>
                  </TableCell>
                  <TableCell className="text-right font-bold">{b.productCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
