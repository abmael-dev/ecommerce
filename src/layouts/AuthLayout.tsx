import React, { Suspense } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { DarkModeToggle } from '@/components/common/DarkModeToggle'
import { ShieldCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors p-4 sm:p-6">
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="text-xl font-black text-slate-900 dark:text-white">
          AURA<span className="text-indigo-600 dark:text-indigo-400">.STORE</span>
        </Link>
        <DarkModeToggle />
      </header>

      <main className="w-full max-w-md mx-auto my-8">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Ambiente 100% Seguro & Protegido</span>
      </footer>
    </div>
  )
}
