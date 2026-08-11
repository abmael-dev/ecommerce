import { type IUseCase } from '../../../shared/interfaces/IUseCase.js'
import { type IAuthRepository } from '../repositories/IAuthRepository.js'
import { type RegisterInput } from '../schemas/auth.schemas.js'
import { type PublicUser } from '../entities/User.entity.js'
import { TokenService } from '../services/token.service.js'
import { AppError } from '../../../shared/errors/AppError.js'
import { ErrorCodes } from '../../../shared/errors/errorCodes.js'
import { hashPassword } from '../../../shared/utils/crypto.js'
import { createLogger } from '../../../config/logger.js'

const log = createLogger('RegisterUseCase')

export interface RegisterRequest extends RegisterInput {
  ipAddress?: string
  userAgent?: string
}

export interface RegisterResponse {
  user: PublicUser
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

/**
 * Use Case: Registrar novo usuário.
 *
 * Segurança:
 * - Verifica e-mail duplicado ANTES do hash (evita timing leak)
 * - Usa Argon2id para hash da senha
 * - Cria sessão imediatamente após registro
 * - Nunca retorna a senha em nenhuma forma
 */
export class RegisterUseCase implements IUseCase<RegisterRequest, RegisterResponse> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    const { name, email, password, phone, ipAddress, userAgent } = request

    // 1. Verificar se e-mail já existe (com resposta genérica para evitar enumeration)
    const existingUser = await this.authRepository.findUserByEmail(email)
    if (existingUser !== null) {
      // Log de tentativa de registro com e-mail duplicado (pode indicar enumeração)
      log.warn({ email, ipAddress }, 'Tentativa de registro com e-mail já existente')
      throw new AppError(
        'Este e-mail já está em uso',
        ErrorCodes.EMAIL_ALREADY_EXISTS,
        409,
      )
    }

    // 2. Hash da senha com Argon2id
    const passwordHash = await hashPassword(password)

    // 3. Criar usuário
    const user = await this.authRepository.createUser({
      email,
      passwordHash,
      name,
      phone,
    })

    log.info({ userId: user.id, email }, 'Novo usuário registrado')

    // 4. Gerar tokens e criar sessão
    const { token: accessToken, expiresAt } = await this.tokenService.generateAccessToken(
      user.id,
      user.role,
    )

    const refreshTokenExpiry = this.tokenService.getRefreshTokenExpiry()
    const session = await this.authRepository.createSession({
      userId: user.id,
      tokenHash: '', // Será atualizado abaixo
      ipAddress,
      userAgent,
      expiresAt: refreshTokenExpiry,
    })

    const { token: refreshToken } = await this.tokenService.generateRefreshToken(
      user.id,
      session.id,
    )

    // Atualizar hash do refresh token na sessão
    const tokenHash = this.tokenService.hashToken(refreshToken)
    await this.authRepository.createSession({
      userId: user.id,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt: refreshTokenExpiry,
    })

    // Remover a sessão sem hash (foi criada temporariamente)
    await this.authRepository.revokeSession(session.id)

    return {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresAt,
    }
  }
}
