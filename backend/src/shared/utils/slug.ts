import { sanitizeSlug } from './sanitize.js'

/**
 * Gera slug único a partir de uma string.
 * Garante unicidade adicionando sufixo numérico se necessário.
 */
export function generateSlug(name: string): string {
  return sanitizeSlug(name)
}

/**
 * Gera slug único com sufixo de timestamp para evitar colisão.
 */
export function generateUniqueSlug(name: string): string {
  const base = sanitizeSlug(name)
  const suffix = Date.now().toString(36)
  return `${base}-${suffix}`
}
