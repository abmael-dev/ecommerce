import { type PaginationMeta } from '../interfaces/IRepository.js'

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Cria uma resposta de sucesso padronizada.
 */
export function successResponse<T>(data: T, meta?: PaginationMeta): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta !== undefined ? { meta } : {}),
  }
}

/**
 * Cria uma resposta de erro padronizada.
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  }
}
