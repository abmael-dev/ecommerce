import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Lock, ShieldAlert } from 'lucide-react'

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xl">
        <Lock className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100">403</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Acesso Restrito</h2>
      <p className="text-xs text-slate-500 max-w-md leading-relaxed">
        Você não possui permissão de acesso a esta página.
      </p>
      <Link to="/" className="pt-2">
        <Button variant="primary">Voltar ao Início</Button>
      </Link>
    </div>
  )
}
