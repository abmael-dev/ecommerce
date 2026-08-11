import { PrismaClient } from '@prisma/client'
import {
  type IAuthRepository,
  type UserWithPassword,
  type CreateUserData,
  type UpdateUserData,
  type CreateSessionData,
  type SessionData,
  type CreatePasswordResetData,
  type PasswordResetData,
} from './IAuthRepository.js'
import { UserEntity } from '../entities/User.entity.js'

/**
 * Implementação Prisma do repositório de autenticação.
 * Único ponto de acesso ao banco para operações de auth.
 * Nunca retorna passwordHash em métodos públicos de User.
 */
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ─── USUÁRIOS ──────────────────────────────────────────────────────────────

  async findUserById(id: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    })
    return user as UserWithPassword | null
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        // Não filtra por deletedAt para verificar contas deletadas no login
      },
    })
    return user as UserWithPassword | null
  }

  async createUser(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        name: data.name.trim(),
        phone: data.phone ?? null,
      },
    })

    return new UserEntity(
      user.id,
      user.email,
      user.name,
      user.role,
      user.isActive,
      user.isEmailVerified,
      user.phone,
      user.lastLoginAt,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    )
  }

  async updateUser(id: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isEmailVerified !== undefined ? { isEmailVerified: data.isEmailVerified } : {}),
        ...(data.emailVerifiedAt !== undefined ? { emailVerifiedAt: data.emailVerifiedAt } : {}),
        ...(data.lastLoginAt !== undefined ? { lastLoginAt: data.lastLoginAt } : {}),
        ...(data.loginAttempts !== undefined ? { loginAttempts: data.loginAttempts } : {}),
        ...(data.lockedUntil !== undefined ? { lockedUntil: data.lockedUntil } : {}),
        ...(data.deletedAt !== undefined ? { deletedAt: data.deletedAt } : {}),
      },
    })

    return new UserEntity(
      user.id,
      user.email,
      user.name,
      user.role,
      user.isActive,
      user.isEmailVerified,
      user.phone,
      user.lastLoginAt,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    )
  }

  async softDeleteUser(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    })
  }

  // ─── SESSÕES ──────────────────────────────────────────────────────────────

  async createSession(data: CreateSessionData): Promise<SessionData> {
    const session = await this.prisma.session.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        userAgent: data.userAgent ?? null,
        ipAddress: data.ipAddress ?? null,
        expiresAt: data.expiresAt,
      },
    })
    return session as SessionData
  }

  async findSessionByTokenHash(tokenHash: string): Promise<SessionData | null> {
    const session = await this.prisma.session.findFirst({
      where: { tokenHash, isRevoked: false },
    })
    return session as SessionData | null
  }

  async revokeSession(id: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { isRevoked: true, revokedAt: new Date() },
    })
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    })
  }

  async deleteExpiredSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } },
    })
  }

  // ─── TENTATIVAS DE LOGIN ──────────────────────────────────────────────────

  async incrementLoginAttempts(userId: string): Promise<number> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: { increment: 1 } },
      select: { loginAttempts: true },
    })
    return user.loginAttempts
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: 0, lockedUntil: null },
    })
  }

  async lockAccount(userId: string, until: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: until },
    })
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    })
  }

  // ─── RESET DE SENHA ──────────────────────────────────────────────────────

  async createPasswordReset(data: CreatePasswordResetData): Promise<void> {
    await this.prisma.passwordReset.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    })
  }

  async findPasswordReset(tokenHash: string): Promise<PasswordResetData | null> {
    const reset = await this.prisma.passwordReset.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    })
    return reset as PasswordResetData | null
  }

  async markPasswordResetUsed(id: string): Promise<void> {
    await this.prisma.passwordReset.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  }

  async invalidatePreviousPasswordResets(userId: string): Promise<void> {
    // Marca todos os tokens anteriores como usados (invalida tokens pendentes)
    await this.prisma.passwordReset.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    })
  }
}
