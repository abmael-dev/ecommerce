import { type IUseCase } from '../../../shared/interfaces/IUseCase.js'
import { type IAuthRepository } from '../repositories/IAuthRepository.js'
import { TokenService } from '../services/token.service.js'
import { AppError } from '../../../shared/errors/AppError.js'
import { ErrorCodes } from '../../../shared/errors/errorCodes.js'
import { createLogger } from '../../../config/logger.js'

const log = createLogger('RefreshTokenUseCase')

export interface RefreshTokenRequest {
  refreshToken: string
  ipAddress?: string
  userAgent?: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

/**
 * Use Case: Renovação de tokens via Refresh Token Rotativo.
 *
 * Implementação Rotativa:
 * 1. Verifica o refresh token JWT
 * 2. Busca a sessão no banco pelo hash do token
 * 3. Revoga a sessão atual (token rotativo — não pode ser reutilizado)
 * 4. Cria nova sessão com novo refresh token
 * 5. Retorna novo par de tokens
 *
 * Detecção de Reutilização (Replay Attack):
 * - Se o refresh token já foi revogado, revoga TODAS as sessões do usuário
 * - Indica possível comprometimento do token
 */
export class RefreshTokenUseCase implements IUseCase<RefreshTokenRequest, RefreshTokenResponse> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refreshToken, ipAddress, userAgent } = request

    // 1. Verificar assinatura JWT do refresh token
    let payload: { sub: string; jti: string; type: string }
    try {
      payload = await this.tokenService.verifyRefreshToken(refreshToken)
    } catch {
      log.warn({ ipAddress }, 'Refresh token com assinatura inválida')
      throw new AppError('Token inválido ou expirado', ErrorCodes.INVALID_TOKEN, 401)
    }

    // 2. Hash do token para busca no banco
    const tokenHash = this.tokenService.hashToken(refreshToken)

    // 3. Buscar sessão no banco
    const session = await this.authRepository.findSessionByTokenHash(tokenHash)

    if (session === null) {
      // Token não encontrado — pode ser reutilização (replay attack)
      log.warn(
        { userId: payload['sub'], ipAddress },
        'Refresh token não encontrado — possível replay attack. Revogando todas as sessões.',
      )
      // Revogar TODAS as sessões do usuário como medida de segurança
      await this.authRepository.revokeAllUserSessions(payload['sub'])
      throw new AppError(
        'Sessão inválida. Faça login novamente.',
        ErrorCodes.TOKEN_REUSE_DETECTED,
        401,
      )
    }

    // 4. Verificar se sessão está expirada
    if (session.expiresAt < new Date()) {
      await this.authRepository.revokeSession(session.id)
      throw new AppError('Sessão expirada. Faça login novamente.', ErrorCodes.SESSION_EXPIRED, 401)
    }

    // 5. Buscar usuário para obter role atualizada (nunca confia no JWT)
    const user = await this.authRepository.findUserById(session.userId)
    if (user === null || !user.isActive || user.deletedAt !== null) {
      await this.authRepository.revokeSession(session.id)
      throw new AppError('Usuário não encontrado ou inativo', ErrorCodes.ACCOUNT_INACTIVE, 401)
    }

    // 6. REVOGAR sessão atual (rotação do token)
    await this.authRepository.revokeSession(session.id)

    log.info({ userId: user.id, sessionId: session.id }, 'Refresh token rotacionado')

    // 7. Gerar novos tokens
    const { token: newAccessToken, expiresAt } = await this.tokenService.generateAccessToken(
      user.id,
      user.role,
    )

    const refreshTokenExpiry = this.tokenService.getRefreshTokenExpiry()
    const { token: newRefreshToken } = await this.tokenService.generateRefreshToken(
      user.id,
      'new-session',
    )

    const newTokenHash = this.tokenService.hashToken(newRefreshToken)

    // 8. Criar nova sessão
    await this.authRepository.createSession({
      userId: user.id,
      tokenHash: newTokenHash,
      ipAddress,
      userAgent,
      expiresAt: refreshTokenExpiry,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt,
    }
  }
}
