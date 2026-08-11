import { z } from 'zod'

/**
 * Política de senha: mínimo 12 chars, maiúscula, minúscula, número, símbolo.
 * Conforme especificado pelo OWASP ASVS.
 */
const passwordPolicy = z
  .string()
  .min(12, 'A senha deve ter no mínimo 12 caracteres')
  .max(128, 'A senha deve ter no máximo 128 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um símbolo especial')

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres')
    .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Nome contém caracteres inválidos'),
  email: z
    .string()
    .email('E-mail inválido')
    .max(320, 'E-mail deve ter no máximo 320 caracteres')
    .toLowerCase()
    .trim(),
  password: passwordPolicy,
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido (formato E.164)')
    .optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido').max(320).toLowerCase().trim(),
  password: z.string().min(1, 'Senha é obrigatória').max(128),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido').max(320).toLowerCase().trim(),
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1).max(200),
  password: passwordPolicy,
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória').max(128),
  newPassword: passwordPolicy,
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
