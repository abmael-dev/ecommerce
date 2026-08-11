import { type ErrorCode } from './errorCodes.js'

/**
 * Classe base de erros de aplicação.
 * Estende Error nativo para preservar stack trace.
 *
 * Todos os erros de domínio/negócio devem estender AppError.
 */
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly details?: unknown

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 400,
    details?: unknown,
    isOperational: boolean = true,
  ) {
    super(message)

    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.details = details

    // Captura stack trace corretamente em V8
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, this.constructor)
    }

    Object.setPrototypeOf(this, AppError.prototype)
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}
