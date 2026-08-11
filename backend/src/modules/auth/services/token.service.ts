import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import * as crypto from 'node:crypto'
import { env } from '../../../config/env.js'

/**
 * Payload do Access Token JWT.
 * Contém apenas o mínimo necessário — nunca dados sensíveis.
 */
export interface AccessTokenPayload extends JWTPayload {
  sub: string   // userId
  jti: string   // JWT ID único (para blacklist)
  role: 'CLIENT' | 'ADMIN'
  type: 'access'
}

/**
 * Payload do Refresh Token JWT (interno).
 * O token em si não fica no banco — apenas seu hash.
 */
export interface RefreshTokenPayload extends JWTPayload {
  sub: string   // userId
  jti: string   // Session ID no banco
  type: 'refresh'
}

const accessSecretKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET)
const refreshSecretKey = new TextEncoder().encode(env.JWT_REFRESH_SECRET)

/**
 * Serviço de tokens JWT.
 * Usa a biblioteca `jose` (Web Crypto API — compatível com Edge Runtime).
 */
export class TokenService {
  /**
   * Gera Access Token JWT com expiração curta.
   */
  async generateAccessToken(
    userId: string,
    role: 'CLIENT' | 'ADMIN',
  ): Promise<{ token: string; jti: string; expiresAt: Date }> {
    const jti = crypto.randomUUID()
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = this.parseExpiresIn(env.JWT_ACCESS_EXPIRES_IN)
    const expiresAt = new Date((now + expiresIn) * 1000)

    const token = await new SignJWT({
      role,
      type: 'access',
    } satisfies Omit<AccessTokenPayload, keyof JWTPayload>)
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setJti(jti)
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setIssuer(env.APP_URL)
      .setAudience(env.FRONTEND_URL)
      .sign(accessSecretKey)

    return { token, jti, expiresAt }
  }

  /**
   * Gera Refresh Token JWT com expiração longa.
   * O sessionId é o ID da sessão no banco — permite rastreamento.
   */
  async generateRefreshToken(
    userId: string,
    sessionId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = this.parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN)
    const expiresAt = new Date((now + expiresIn) * 1000)

    const token = await new SignJWT({
      type: 'refresh',
    } satisfies Omit<RefreshTokenPayload, keyof JWTPayload>)
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setJti(sessionId)
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setIssuer(env.APP_URL)
      .sign(refreshSecretKey)

    return { token, expiresAt }
  }

  /**
   * Verifica e decodifica Access Token.
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify(token, accessSecretKey, {
      algorithms: ['HS256'],
      issuer: env.APP_URL,
      audience: env.FRONTEND_URL,
    })

    if (payload['type'] !== 'access') {
      throw new Error('Token type inválido')
    }

    return payload as AccessTokenPayload
  }

  /**
   * Verifica e decodifica Refresh Token.
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const { payload } = await jwtVerify(token, refreshSecretKey, {
      algorithms: ['HS256'],
      issuer: env.APP_URL,
    })

    if (payload['type'] !== 'refresh') {
      throw new Error('Token type inválido')
    }

    return payload as RefreshTokenPayload
  }

  /**
   * Gera hash SHA-256 do token para armazenamento no banco.
   * Nunca armazena o token em si — apenas seu hash.
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Parseia string de expiração para segundos.
   * Ex: '15m' → 900, '7d' → 604800
   */
  private parseExpiresIn(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value)
    if (match === null) throw new Error(`Formato de expiração inválido: ${value}`)

    const [, num, unit] = match
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 }
    return parseInt(num!, 10) * (multipliers[unit!] ?? 60)
  }

  /**
   * Calcula data de expiração do refresh token para criação no banco.
   */
  getRefreshTokenExpiry(): Date {
    const seconds = this.parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN)
    return new Date(Date.now() + seconds * 1000)
  }
}
