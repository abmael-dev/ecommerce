import { type UserEntity } from '../entities/User.entity.js'

/**
 * Interface do repositório de autenticação.
 * Desacopla o use case da implementação (Prisma, etc.).
 */
export interface IAuthRepository {
  // Usuários
  findUserById(id: string): Promise<UserWithPassword | null>
  findUserByEmail(email: string): Promise<UserWithPassword | null>
  createUser(data: CreateUserData): Promise<UserEntity>
  updateUser(id: string, data: UpdateUserData): Promise<UserEntity>
  softDeleteUser(id: string): Promise<void>

  // Sessões (Refresh Tokens)
  createSession(data: CreateSessionData): Promise<SessionData>
  findSessionByTokenHash(tokenHash: string): Promise<SessionData | null>
  revokeSession(id: string): Promise<void>
  revokeAllUserSessions(userId: string): Promise<void>
  deleteExpiredSessions(userId: string): Promise<void>

  // Tentativas de login
  incrementLoginAttempts(userId: string): Promise<number>
  resetLoginAttempts(userId: string): Promise<void>
  lockAccount(userId: string, until: Date): Promise<void>
  updateLastLogin(userId: string): Promise<void>

  // Reset de senha
  createPasswordReset(data: CreatePasswordResetData): Promise<void>
  findPasswordReset(tokenHash: string): Promise<PasswordResetData | null>
  markPasswordResetUsed(id: string): Promise<void>
  invalidatePreviousPasswordResets(userId: string): Promise<void>
}

export interface UserWithPassword {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'CLIENT' | 'ADMIN'
  isActive: boolean
  isEmailVerified: boolean
  phone: string | null
  lastLoginAt: Date | null
  loginAttempts: number
  lockedUntil: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateUserData {
  email: string
  passwordHash: string
  name: string
  phone?: string | undefined
}

export interface UpdateUserData {
  name?: string
  phone?: string | null
  passwordHash?: string
  isActive?: boolean
  isEmailVerified?: boolean
  emailVerifiedAt?: Date
  lastLoginAt?: Date
  loginAttempts?: number
  lockedUntil?: Date | null
  deletedAt?: Date
}

export interface CreateSessionData {
  userId: string
  tokenHash: string
  userAgent?: string | undefined
  ipAddress?: string | undefined
  expiresAt: Date
}

export interface SessionData {
  id: string
  userId: string
  tokenHash: string
  userAgent: string | null
  ipAddress: string | null
  isRevoked: boolean
  revokedAt: Date | null
  expiresAt: Date
  createdAt: Date
}

export interface CreatePasswordResetData {
  userId: string
  tokenHash: string
  expiresAt: Date
}

export interface PasswordResetData {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
}
