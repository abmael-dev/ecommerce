import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { useToast } from '@/contexts/ToastContext'
import { Mail, Lock, LogIn, ShieldCheck, Sparkles } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()
  const { addToast } = useToast()

  const from = (location.state as any)?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alexandre@example.com',
      password: 'password123',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const user = await authService.login(data)
      setUser(user)
      addToast({
        type: 'success',
        title: 'Bem-vindo de volta!',
        message: `Sessão autenticada via HttpOnly Cookies.`,
      })
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true })
    } catch {
      // Handled globally by Axios interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemo = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@aura.store')
      setValue('password', 'admin123')
    } else {
      setValue('email', 'alexandre@example.com')
      setValue('password', 'password123')
    }
  }

  return (
    <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800">
      <CardHeader className="text-center space-y-1">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Acessar sua Conta</h1>
        <p className="text-xs text-slate-500">Informe suas credenciais para continuar</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Demo Fast Login Buttons */}
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preenchimento Rápido para Testes:</span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemo('customer')}
              className="flex-1 text-[11px] h-8 bg-white dark:bg-slate-900"
            >
              Cliente
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemo('admin')}
              className="flex-1 text-[11px] h-8 bg-white dark:bg-slate-900"
            >
              Administrador
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" />}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Entrar
          </Button>
        </form>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Autenticação baseada em Cookies de Sessão protegidos HttpOnly.</span>
        </div>
      </CardContent>

      <CardFooter className="justify-center text-xs">
        <span className="text-slate-500">Ainda não tem conta? </span>
        <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
          Cadastre-se
        </Link>
      </CardFooter>
    </Card>
  )
}
