import { type IUseCase } from '../../../shared/interfaces/IUseCase.js'
import { type IAuthRepository } from '../repositories/IAuthRepository.js'
import { type LoginInput } from '../schemas/auth.schemas.js'
import { type PublicUser } from '../entities/User.entity.js'
import { TokenService } from '../services/token.service.js'
import { AppError } from '../../../shared/errors/AppError.js'
import { ErrorCodes } from '../../../shared/errors/errorCodes.js'
import { verifyPassword } from '../../../shared/utils/crypto.js'
import { CacheService, CacheKeys } from '../../../cache/cache.service.js'
import { createLogger } from '../../../config/logger.js'
import { UserEntity } from '../entities/User.entity.js'

const log = createLogger('LoginUseCase')

// Configurações de proteção contra brute force
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 30

export interface LoginRequest extends LoginInput {
  ipAddress?: string
  userAgent?: string
}

export interface LoginResponse {
  user: PublicUser
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

/**
 * Use Case: Login do usuário.
 *
 * Proteções implementadas:
 * - Rate limiting por e-mail (Redis) contra brute force
 * - Bloqueio de conta após N tentativas falhas
 * - Argon2id verify para comparação segura
 * - Resposta genérica ("credenciais inválidas") para evitar enumeration attack
 * - Log estruturado de tentativas falhas para detecção de ataques
 * - Timing attack prevention: sempre verifica hash mesmo se usuário não existe
 */
export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
  private readonly cacheService = new CacheService()

  // Hash dummy para executar verificação mesmo quando usuário não existe
  // Previne timing attack por ausência de usuário
  private static readonly DUMMY_HASH =
    '$argon2id$v=19$m=65536,t=3,p=4$dummysaltdummysalt$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash'

  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password, ipAddress, userAgent } = request

    // 1. Verificar rate limit por e-mail via Redis
    await this.checkRateLimit(email, ipAddress)

    // 2. Buscar usuário (não filtra por deletedAt para verificar contas deletadas)
    const userRecord = await this.authRepository.findUserByEmail(email)

    // 3. Verificar hash — SEMPRE executa para prevenir timing attacks
    const hashToVerify = userRecord?.passwordHash ?? LoginUseCase.DUMMY_HASH
    const isPasswordValid = await verifyPassword(hashToVerify, password)

    // 4. Verificações de segurança (após verificação do hash)
    if (userRecord === null || !isPasswordValid) {
      await this.handleFailedAttempt(email, userRecord?.id, ipAddress)
      // Resposta genérica — nunca indica se e-mail ou senha está errado
      throw new AppError('Credenciais inválidas', ErrorCodes.INVALID_CREDENTIALS, 401)
    }

    // 5. Verificar se conta está ativa
    if (!userRecord.isActive || userRecord.deletedAt !== null) {
      log.warn({ userId: userRecord.id, ipAddress }, 'Tentativa de login em conta inativa')
      throw new AppError('Conta inativa ou removida', ErrorCodes.ACCOUNT_INACTIVE, 401)
    }

    // 6. Verificar bloqueio de conta
    if (userRecord.lockedUntil !== null && userRecord.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (userRecord.lockedUntil.getTime() - Date.now()) / 60000,
      )
      log.warn({ userId: userRecord.id, ipAddress }, 'Tentativa de login em conta bloqueada')
      throw new AppError(
        `Conta temporariamente bloqueada. Tente novamente em ${minutesLeft} minutos.`,
        ErrorCodes.ACCOUNT_LOCKED,
        423,
      )
    }

    const user = new UserEntity(
      userRecord.id,
      userRecord.email,
      userRecord.name,
      userRecord.role,
      userRecord.isActive,
      userRecord.isEmailVerified,
      userRecord.phone,
      userRecord.lastLoginAt,
      userRecord.createdAt,
      userRecord.updatedAt,
      userRecord.deletedAt,
    )

    // 7. Login bem-sucedido — limpar tentativas e atualizar último acesso
    await this.authRepository.resetLoginAttempts(user.id)
    await this.authRepository.updateLastLogin(user.id)
    await this.cacheService.del(CacheKeys.loginAttempts(email))
    await this.authRepository.deleteExpiredSessions(user.id)

    log.info({ userId: user.id, ipAddress }, 'Login realizado com sucesso')

    // 8. Gerar tokens
    const { token: accessToken, expiresAt } = await this.tokenService.generateAccessToken(
      user.id,
      user.role,
    )

    const refreshTokenExpiry = this.tokenService.getRefreshTokenExpiry()
    const { token: refreshToken } = await this.tokenService.generateRefreshToken(
      user.id,
      'temp', // Será substituído após criar sessão
    )

    const tokenHash = this.tokenService.hashToken(refreshToken)
    await this.authRepository.createSession({
      userId: user.id,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt: refreshTokenExpiry,
    })

    return {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresAt,
    }
  }

  private async checkRateLimit(email: string, ipAddress?: string): Promise<void> {
    const key = CacheKeys.loginAttempts(email)
    const attempts = await this.cacheService.get<number>(key)

    if (attempts !== null && attempts >= MAX_LOGIN_ATTEMPTS * 2) {
      log.warn({ email, ipAddress, attempts }, 'Rate limit de login excedido via Redis')
      throw new AppError(
        'Muitas tentativas de login. Tente novamente mais tarde.',
        ErrorCodes.ACCOUNT_LOCKED,
        429,
      )
    }
  }

  private async handleFailedAttempt(
    email: string,
    userId?: string,
    ipAddress?: string,
  ): Promise<void> {
    // Incrementar contador Redis
    const redisKey = CacheKeys.loginAttempts(email)
    const redisAttempts = await this.cacheService.incr(redisKey, 900) // 15min window

    log.warn(
      { email, userId, ipAddress, redisAttempts },
      'Tentativa de login inválida',
    )

    if (userId !== undefined) {
      // Incrementar contador no banco
      const dbAttempts = await this.authRepository.incrementLoginAttempts(userId)

      // Bloquear conta após MAX_LOGIN_ATTEMPTS tentativas
      if (dbAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        await this.authRepository.lockAccount(userId, lockUntil)
        log.warn({ userId, ipAddress }, 'Conta bloqueada por excesso de tentativas')
      }
    }
  }
}
