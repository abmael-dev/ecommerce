import sanitizeHtml from 'sanitize-html'

/**
 * Sanitiza string removendo todo HTML e scripts.
 * Proteção contra XSS Stored e Reflected.
 */
export function sanitizeString(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape',
  })
}

/**
 * Sanitiza texto rico (apenas tags seguras).
 * Para campos de descrição que permitem formatação básica.
 */
export function sanitizeRichText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape',
  })
}

/**
 * Sanitiza slug — apenas letras, números e hífens.
 * Previne Path Traversal e Directory Traversal.
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
}

/**
 * Sanitiza nome de arquivo — previne Path Traversal.
 * Nunca usar nomes de arquivo vindos do cliente diretamente.
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '_') // Previne ../
    .replace(/^[.-]/, '_') // Não inicia com ponto ou hífen
    .slice(0, 255)
}

/**
 * Remove campos undefined/null de um objeto.
 * Útil para evitar mass assignment.
 */
export function stripUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null),
  ) as Partial<T>
}

/**
 * Escapa caracteres especiais para uso em regex.
 * Previne ReDoS.
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Trunca string para evitar DoS por entrada excessivamente longa.
 */
export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength)
}
