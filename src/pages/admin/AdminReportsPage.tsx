import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { TrendingUp, DollarSign, Award } from 'lucide-react'

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Relatórios & Performance</h1>
        <p className="text-xs text-slate-500 mt-1">Análises detalhadas de vendas, retenção e ticket médio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold">Ticket Médio</h3>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">R$ 477,30</span>
            <p className="text-xs text-emerald-500 font-semibold mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold">Taxa de Conversão</h3>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">3.8%</span>
            <p className="text-xs text-indigo-500 font-semibold mt-1">Acima da média do setor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold">Categoria Mais Vendida</h3>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">Jaquetas Tech</span>
            <p className="text-xs text-slate-500 mt-1">42% do volume total de vendas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
