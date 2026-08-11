import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Home, Compass } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xl">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Página Não Encontrada</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        O endereço solicitado não existe ou foi movido para outro diretório do catálogo.
      </p>
      <Link to="/" className="pt-4">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Voltar para a Página Inicial
        </Button>
      </Link>
    </div>
  )
}
