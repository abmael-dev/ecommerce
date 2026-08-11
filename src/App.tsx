import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { AppRoutes } from '@/routes/AppRoutes'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export const App: React.FC = () => {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Check initial session with Node.js backend using HttpOnly cookie credentials
    const initAuth = async () => {
      try {
        const currentUser = await authService.getMe()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen to global logout event dispatched by Axios 401 interceptor
    const handleLogout = () => {
      setUser(null)
    }

    window.addEventListener('auth-logout', handleLogout)
    return () => window.removeEventListener('auth-logout', handleLogout)
  }, [setUser, setLoading])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
