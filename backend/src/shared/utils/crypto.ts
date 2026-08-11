import * as crypto from 'node:crypto'
import { promisify } from 'node:util'
import argon2 from 'argon2'
import { env } from '../../config/env.js'

const scryptAsync = promisify(crypto.scrypt)

// ─── ARGON2ID ────────────────────────────────────────────────────────────────

export const argon2Config = {
  type: argon2.argon2id,
  memoryCost: env.ARGON2_MEMORY_COST,
  timeCost: env.ARGON2_TIME_COST,
  parallelism: env.ARGON2_PARALLELISM,
  // Salt aleatório por padrão (argon2 gera internamente)
} as const

/**
 * Gera hash Argon2id da senha.
 * Salt aleatório é gerado e incluído no hash automaticamente.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, argon2Config)
}

/**
 * Verifica senha contra hash Argon2id.
 * Usa comparação em tempo constante internamente — resistente a timing attacks.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password, { type: argon2.argon2id })
}

// ─── HMAC (Reset tokens, CSRF) ────────────────────────────────────────────────

/**
 * Gera token aleatório criptograficamente seguro.
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Gera HMAC-SHA256 do token.
 * Usado para armazenar apenas o hash no banco (nunca o token em si).
 */
export function hmacHash(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

/**
 * Comparação segura em tempo constante.
 * Previne timing attacks na comparação de tokens.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Mesmo que os comprimentos sejam diferentes, fazemos a comparação
    // com strings de mesmo tamanho para evitar vazamento de tempo
    const paddedA = a.padEnd(b.length, '\0')
    const paddedB = b.padEnd(a.length, '\0')
    const bufA = Buffer.from(paddedA)
    const bufB = Buffer.from(paddedB)
    crypto.timingSafeEqual(bufA, bufB) // Executa mas ignora resultado
    return false
  }

  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return crypto.timingSafeEqual(bufA, bufB)
}

// ─── UUID ─────────────────────────────────────────────────────────────────────

/**
 * Gera UUID v4 criptograficamente seguro.
 */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Valida formato de UUID v4.
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

// ─── SCRYPT (derivação de chave) ──────────────────────────────────────────────

/**
 * Deriva chave via scrypt (para uso em criptografia simétrica, não senhas).
 */
export async function deriveKey(
  input: string,
  salt: string,
  keylen: number = 32,
): Promise<Buffer> {
  return scryptAsync(input, salt, keylen) as Promise<Buffer>
}

// ─── ORDER NUMBER ─────────────────────────────────────────────────────────────

/**
 * Gera número de pedido único e legível.
 * Formato: ORD-YYYYMMDD-XXXXXXXXXX
 */
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = crypto.randomBytes(5).toString('hex').toUpperCase()
  return `ORD-${date}-${random}`
}
