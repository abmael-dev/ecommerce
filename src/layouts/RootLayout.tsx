import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { Skeleton } from '@/components/ui/Skeleton'

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
              <Skeleton className="h-48 w-full rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
