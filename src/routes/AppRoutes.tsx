import React, { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Lazy loaded page components for Code Splitting
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const ProductsPage = lazy(() => import('@/pages/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const CartPage = lazy(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })))
const WishlistPage = lazy(() => import('@/pages/WishlistPage').then((m) => ({ default: m.WishlistPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AccountPage = lazy(() => import('@/pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage })))

// Admin Lazy Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })))
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage').then((m) => ({ default: m.AdminBrandsPage })))
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })))
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage })))
const AdminCouponsPage = lazy(() => import('@/pages/admin/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage })))
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage').then((m) => ({ default: m.AdminReportsPage })))

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<WishlistPage />} />

        {/* Authenticated Customer Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Error Pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Panel Layout Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="brands" element={<AdminBrandsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  )
}
