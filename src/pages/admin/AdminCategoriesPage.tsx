import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

export const AdminCategoriesPage: React.FC = () => {
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.getCategories(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Categorias de Produtos</h1>
        <p className="text-xs text-slate-500 mt-1">Organização de estrutura do catálogo</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Produtos Associados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold">{c.name}</TableCell>
                  <TableCell><code className="text-xs text-indigo-600 dark:text-indigo-400">{c.slug}</code></TableCell>
                  <TableCell className="text-xs text-slate-500">{c.description || 'Sem descrição'}</TableCell>
                  <TableCell className="text-right font-bold">{c.productCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
