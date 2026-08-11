import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, User as UserIcon, Search, ShieldCheck, LayoutDashboard } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { useCartStore } from '@/features/cart/store/useCartStore'
import { useWishlistStore } from '@/features/wishlist/store/useWishlistStore'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { authService } from '@/services/authService'

export const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { openCart, getItemCount } = useCartStore()
  const wishlistItems = useWishlistStore((s) => s.items)
  const { user, isAuthenticated, logout } = useAuthStore()

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Top Security Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Arquitetura Frontend Segura & Desacoplada | Regras de Negócio e Sessão via HttpOnly Server Cookies</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>Suporte 24/7</span>
          <span>Frete Grátis acima de R$ 299</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white group">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-md shadow-indigo-500/30">
            A
          </div>
          <span>AURA<span className="text-indigo-600 dark:text-indigo-400">.STORE</span></span>
        </Link>

        {/* Instant Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Pesquisar jaquetas, camisetas, tênis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/products"
            className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
          >
            Produtos
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/favorites"
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <DarkModeToggle />

          {/* Admin Link if Admin */}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
              title="Painel Administrativo"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}

          {/* Auth User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link to="/account" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-indigo-500" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden lg:inline max-w-[100px] truncate">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:underline ml-1 hidden sm:inline"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors ml-1 shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
