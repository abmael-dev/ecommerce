import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'
import type { ApiUserError } from '@/lib/axios'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message, duration }])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  // Listen to global Axios API errors automatically
  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<ApiUserError>
      if (customEvent.detail?.message) {
        addToast({
          type: 'error',
          title: 'Atenção',
          message: customEvent.detail.message,
        })
      }
    }

    window.addEventListener('api-error', handleApiError)
    return () => window.removeEventListener('api-error', handleApiError)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              </div>

              <div className="flex-1 text-sm">
                {toast.title && <h4 className="font-semibold text-slate-900 dark:text-white leading-tight mb-0.5">{toast.title}</h4>}
                <p className="text-slate-600 dark:text-slate-300 leading-snug">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
