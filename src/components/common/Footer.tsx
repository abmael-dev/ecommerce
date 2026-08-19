import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, RefreshCw, Truck } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-100 dark:border-slate-900 py-8 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Entrega Expressa</h4>
              <p className="text-[11px] text-slate-500">Envio para todo o Brasil</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Checkout 100% Seguro</h4>
              <p className="text-[11px] text-slate-500">Criptografia SSL de 256 bits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Troca Descomplicada</h4>
              <p className="text-[11px] text-slate-500">Até 30 dias para devolução</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Garantia de Qualidade</h4>
              <p className="text-[11px] text-slate-500">Produtos 100% originais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <Link to="/" className="text-xl font-black text-slate-900 dark:text-white">
            AURA<span className="text-indigo-600 dark:text-indigo-400">.STORE</span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Sua loja online definitiva para moda, tênis e acessórios. Os melhores lançamentos com entrega rápida e pagamento seguro.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Categorias</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products?category=roupas" className="hover:text-indigo-600 dark:hover:text-indigo-400">Roupas</Link></li>
            <li><Link to="/products?category=calcados" className="hover:text-indigo-600 dark:hover:text-indigo-400">Calçados</Link></li>
            <li><Link to="/products?category=acessorios" className="hover:text-indigo-600 dark:hover:text-indigo-400">Acessórios</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Minha Conta</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/account" className="hover:text-indigo-600 dark:hover:text-indigo-400">Perfil</Link></li>
            <li><Link to="/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400">Meus Pedidos</Link></li>
            <li><Link to="/favorites" className="hover:text-indigo-600 dark:hover:text-indigo-400">Favoritos</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Atendimento</h5>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-500">Central de Ajuda</span></li>
            <li><span className="text-slate-500">Política de Privacidade</span></li>
            <li><span className="text-slate-500">Termos de Uso</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AURA STORE. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
