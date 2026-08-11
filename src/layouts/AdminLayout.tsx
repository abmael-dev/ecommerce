import React, { Suspense } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  LogOut,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react'
import { DarkModeToggle } from '@/components/common/DarkModeToggle'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { authService } from '@/services/authService'
import { Skeleton } from '@/components/ui/Skeleton'

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.logout()
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Visão Geral', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Produtos', path: '/admin/products', icon: Package },
    { label: 'Categorias', path: '/admin/categories', icon: Layers },
    { label: 'Marcas', path: '/admin/brands', icon: Tag },
    { label: 'Pedidos', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Clientes', path: '/admin/customers', icon: Users },
    { label: 'Cupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Relatórios', path: '/admin/reports', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo & Security Note */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="text-lg font-black tracking-tight flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-lg text-xs">ADMIN</span>
              <span>AURA.STORE</span>
            </Link>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Autorização verificada estritamente no backend.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@aura.store'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link to="/" className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Loja</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Painel de Controle Administrativo</h2>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
          </div>
        </header>

        {/* Admin Content View */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
