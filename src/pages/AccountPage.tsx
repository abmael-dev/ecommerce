import React from 'react'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Mail, Calendar, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AccountPage: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Minha Conta</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'neutral'}>
            {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-slate-400 block">E-mail Cadastrado</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-slate-400 block">Membro Desde</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.createdAt || '2026-01-01'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link to="/orders">
              <Button variant="outline" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Ver Meus Pedidos
              </Button>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Sessão Protegida via Servidor</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
