import { type IUseCaseNoOutput } from '../../../shared/interfaces/IUseCase.js'
import { type IAuthRepository } from '../repositories/IAuthRepository.js'
import { TokenService } from '../services/token.service.js'
import { AppError } from '../../../shared/errors/AppError.js'
import { ErrorCodes } from '../../../shared/errors/errorCodes.js'
import { createLogger } from '../../../config/logger.js'

const log = createLogger('LogoutUseCase')

export interface LogoutRequest {
  refreshToken: string
  userId: string
}

/**
 * Use Case: Logout — revoga apenas a sessão atual.
 */
export class LogoutUseCase implements IUseCaseNoOutput<LogoutRequest> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(request: LogoutRequest): Promise<void> {
    const { refreshToken, userId } = request

    const tokenHash = this.tokenService.hashToken(refreshToken)
    const session = await this.authRepository.findSessionByTokenHash(tokenHash)

    if (session === null) {
      // Token não encontrado — já inválido, não é erro crítico
      log.warn({ userId }, 'Logout com refresh token não encontrado')
      return
    }

    // Verificar que a sessão pertence ao usuário autenticado (IDOR prevention)
    if (session.userId !== userId) {
      log.warn({ userId, sessionUserId: session.userId }, 'Tentativa de logout de sessão de outro usuário')
      throw new AppError('Acesso negado', ErrorCodes.FORBIDDEN, 403)
    }

    await this.authRepository.revokeSession(session.id)
    log.info({ userId, sessionId: session.id }, 'Logout realizado')
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export interface LogoutAllRequest {
  userId: string
}

/**
 * Use Case: Logout de todas as sessões (revogar todos os refresh tokens).
 */
export class LogoutAllUseCase implements IUseCaseNoOutput<LogoutAllRequest> {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(request: LogoutAllRequest): Promise<void> {
    const { userId } = request
    await this.authRepository.revokeAllUserSessions(userId)
    log.info({ userId }, 'Todas as sessões revogadas (logout-all)')
  }
}
