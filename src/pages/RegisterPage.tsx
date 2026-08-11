import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { useToast } from '@/contexts/ToastContext'
import { User as UserIcon, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const user = await authService.register(data)
      setUser(user)
      addToast({
        type: 'success',
        title: 'Conta criada!',
        message: `Sua conta foi criada com sucesso. Bem-vindo à AURA.STORE!`,
      })
      navigate('/')
    } catch {
      // Handled globally
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800">
      <CardHeader className="text-center space-y-1">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Criar Nova Conta</h1>
        <p className="text-xs text-slate-500">Cadastre seus dados para acompanhar pedidos</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            error={errors.name?.message}
            leftIcon={<UserIcon className="w-4 h-4" />}
            {...register('name')}
          />

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
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Cadastrar
          </Button>
        </form>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Formulário com sanitização prévia e validação autoritativa no servidor.</span>
        </div>
      </CardContent>

      <CardFooter className="justify-center text-xs">
        <span className="text-slate-500">Já possui uma conta? </span>
        <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
          Faça Login
        </Link>
      </CardFooter>
    </Card>
  )
}
