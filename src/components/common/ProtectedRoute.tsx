import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Skeleton } from '@/components/ui/Skeleton'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role client-side for UX redirection (server strictly validates endpoints)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
