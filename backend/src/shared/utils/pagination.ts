import { type PaginationMeta, type FindAllOptions } from '../interfaces/IRepository.js'

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export interface PaginationQuery {
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
  search?: string
}

/**
 * Normaliza e valida parâmetros de paginação.
 * Previne DoS por paginação excessiva.
 */
export function parsePaginationQuery(query: Record<string, unknown>): FindAllOptions {
  const page = Math.max(1, Number(query['page']) || PAGINATION_DEFAULTS.PAGE)
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, Number(query['limit']) || PAGINATION_DEFAULTS.LIMIT),
  )
  const orderDir =
    query['orderDir'] === 'desc' || query['orderDir'] === 'asc' ? query['orderDir'] : 'desc'
  const search = typeof query['search'] === 'string' ? query['search'].slice(0, 200) : undefined
  const orderBy = typeof query['orderBy'] === 'string' ? query['orderBy'] : undefined

  return { page, limit, orderDir, search, orderBy }
}

/**
 * Calcula metadados de paginação.
 */
export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * Calcula offset para queries SQL.
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}
