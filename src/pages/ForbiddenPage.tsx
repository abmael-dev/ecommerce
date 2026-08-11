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
        Você não possui privilégios de acesso a esta área. Toda tentativa de acesso a rotas administrativas é auditada pelo servidor.
      </p>
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>Toda decisão de autorização ocorre exclusivamente na API.</span>
      </div>
      <Link to="/" className="pt-2">
        <Button variant="primary">Voltar ao Início</Button>
      </Link>
    </div>
  )
}
