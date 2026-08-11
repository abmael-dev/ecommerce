import { z } from 'zod'
import 'dotenv/config'

/**
 * Validação de variáveis de ambiente via Zod.
 * Falha fast na inicialização se alguma variável crítica estiver ausente.
 * Zero Trust: nunca assume valores padrão para segredos.
 */
const envSchema = z.object({
  // Aplicação
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().ip().or(z.literal('0.0.0.0')).default('0.0.0.0'),
  API_VERSION: z.string().regex(/^v\d+$/).default('v1'),
  APP_NAME: z.string().min(1).default('E-Commerce API'),
  APP_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),

  // Banco de dados
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  DB_POOL_MIN: z.coerce.number().int().min(1).max(50).default(2),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),

  // Redis
  REDIS_URL: z.string().url().startsWith('redis'),
  REDIS_TLS: z.coerce.boolean().default(false),

  // JWT — segredos obrigatórios, mínimo 64 caracteres
  JWT_ACCESS_SECRET: z.string().min(64, 'JWT_ACCESS_SECRET deve ter no mínimo 64 caracteres'),
  JWT_REFRESH_SECRET: z.string().min(64, 'JWT_REFRESH_SECRET deve ter no mínimo 64 caracteres'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cookies
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET deve ter no mínimo 32 caracteres'),

  // Argon2id
  ARGON2_MEMORY_COST: z.coerce.number().int().min(16384).default(65536),
  ARGON2_TIME_COST: z.coerce.number().int().min(2).default(3),
  ARGON2_PARALLELISM: z.coerce.number().int().min(1).default(4),

  // Upload
  UPLOAD_MAX_FILE_SIZE: z.coerce.number().int().min(1024).max(10485760).default(5242880),
  UPLOAD_ALLOWED_TYPES: z
    .string()
    .default('image/jpeg,image/png,image/webp')
    .transform((v) => v.split(',').map((t) => t.trim())),
  UPLOAD_DEST: z.string().default('./src/uploads'),

  // Rate Limit
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60000),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().min(1).default(10),
  RATE_LIMIT_AUTH_WINDOW_MS: z.coerce.number().int().min(1000).default(900000),

  // CORS
  CORS_ORIGIN: z.string().url(),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),

  // Segurança
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET deve ter no mínimo 32 caracteres'),
  RESET_PASSWORD_SECRET: z
    .string()
    .min(32, 'RESET_PASSWORD_SECRET deve ter no mínimo 32 caracteres'),
  RESET_PASSWORD_EXPIRES_IN: z.coerce.number().int().min(300).max(86400).default(3600),

  // Email
  MAIL_PROVIDER: z.enum(['mock', 'smtp', 'sendgrid', 'resend']).default('mock'),
  MAIL_FROM: z.string().email().optional(),

  // Logs
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z.coerce.boolean().default(false),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const message = Object.entries(errors)
      .map(([field, msgs]) => `  ${field}: ${msgs?.join(', ')}`)
      .join('\n')

    // Erros de configuração devem terminar o processo imediatamente
    process.stderr.write(`\n❌ Variáveis de ambiente inválidas:\n${message}\n\n`)
    process.exit(1)
  }

  return result.data
}

export const env = validateEnv()
export type { Env }
