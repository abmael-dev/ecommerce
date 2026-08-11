import { AppError } from './AppError.js'
import { ErrorCodes } from './errorCodes.js'

/**
 * Erros HTTP semânticos pré-construídos.
 * Uso: throw new HttpErrors.NotFound('Produto não encontrado')
 */
export const HttpErrors = {
  BadRequest: (message: string, details?: unknown) =>
    new AppError(message, ErrorCodes.VALIDATION_ERROR, 400, details),

  Unauthorized: (message: string = 'Não autenticado') =>
    new AppError(message, ErrorCodes.UNAUTHORIZED, 401),

  Forbidden: (message: string = 'Acesso negado') =>
    new AppError(message, ErrorCodes.FORBIDDEN, 403),

  NotFound: (message: string = 'Recurso não encontrado') =>
    new AppError(message, ErrorCodes.NOT_FOUND, 404),

  Conflict: (message: string, code = ErrorCodes.USER_ALREADY_EXISTS) =>
    new AppError(message, code, 409),

  UnprocessableEntity: (message: string, details?: unknown) =>
    new AppError(message, ErrorCodes.VALIDATION_ERROR, 422, details),

  TooManyRequests: (message: string = 'Muitas requisições. Tente novamente mais tarde.') =>
    new AppError(message, ErrorCodes.RATE_LIMIT_EXCEEDED, 429),

  InternalServerError: (message: string = 'Erro interno do servidor') =>
    new AppError(message, ErrorCodes.INTERNAL_SERVER_ERROR, 500, undefined, false),

  ServiceUnavailable: (message: string = 'Serviço temporariamente indisponível') =>
    new AppError(message, ErrorCodes.SERVICE_UNAVAILABLE, 503),
} as const
