import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'

export const AdminCustomersPage: React.FC = () => {
  const { data: customers } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminService.getCustomers(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Clientes Cadastrados</h1>
        <p className="text-xs text-slate-500 mt-1">Lista de usuários registrados na plataforma</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : 'neutral'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
