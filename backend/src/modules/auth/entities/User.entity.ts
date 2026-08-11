import { type UserRole } from '@prisma/client'

/**
 * Entidade User — representa um usuário no domínio.
 * Nunca expõe passwordHash diretamente.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly isEmailVerified: boolean,
    public readonly phone: string | null,
    public readonly lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  public isDeleted(): boolean {
    return this.deletedAt !== null
  }

  public isAdmin(): boolean {
    return this.role === 'ADMIN'
  }

  public isClient(): boolean {
    return this.role === 'CLIENT'
  }

  public canLogin(): boolean {
    return this.isActive && !this.isDeleted()
  }

  /**
   * Serialização segura — nunca inclui passwordHash.
   */
  public toPublicJSON(): PublicUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      phone: this.phone,
      isEmailVerified: this.isEmailVerified,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
    }
  }
}

export interface PublicUser {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string | null
  isEmailVerified: boolean
  lastLoginAt: Date | null
  createdAt: Date
}
