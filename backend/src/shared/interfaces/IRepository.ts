/**
 * Interface genérica de repositório.
 * Garante contrato uniforme para todos os repositórios.
 * Permite fácil substituição de implementação (Prisma, Knex, etc.).
 */
export interface IRepository<T, CreateDTO, UpdateDTO = Partial<CreateDTO>> {
  findById(id: string): Promise<T | null>
  findAll(options?: FindAllOptions): Promise<PaginatedResult<T>>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
  softDelete?(id: string): Promise<void>
}

export interface FindAllOptions {
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
  includeDeleted?: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
