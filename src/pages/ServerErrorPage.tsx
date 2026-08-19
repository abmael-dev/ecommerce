import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ServerCrash, RefreshCw } from 'lucide-react'

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xl">
        <ServerCrash className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100">500</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Instabilidade Temporária</h2>
      <p className="text-xs text-slate-500 max-w-md leading-relaxed">
        Nosso sistema encontrou uma oscilação momentânea. Por favor, recarregue a página ou tente novamente em instantes.
      </p>
      <Link to="/" className="pt-2">
        <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Tentar Novamente
        </Button>
      </Link>
    </div>
  )
}
