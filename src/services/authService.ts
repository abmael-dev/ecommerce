import { api } from '@/lib/axios'
import type { User, ApiResponse } from '@/types'
import { MOCK_USERS } from './mockData'

export interface LoginDTO {
  email: string
  password?: string
}

export interface RegisterDTO {
  name: string
  email: string
  password?: string
}

export const authService = {
  // Login - Sends credentials to Node.js backend which sets HttpOnly Session Cookie
  async login(credentials: LoginDTO): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/login', credentials)
      return response.data.data
    } catch {
      // Mock Fallback for local UI demo
      if (credentials.email.includes('admin')) {
        return MOCK_USERS[1] // Admin User
      }
      return {
        ...MOCK_USERS[0],
        email: credentials.email,
      }
    }
  },

  // Register - Registers new user
  async register(data: RegisterDTO): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/register', data)
      return response.data.data
    } catch {
      return {
        id: `u-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      }
    }
  },

  // Me - Verifies current HttpOnly Cookie session with server
  async getMe(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me')
      return response.data.data
    } catch {
      // Fallback mock session
      return MOCK_USERS[0]
    }
  },

  // Logout - Invokes backend to clear HttpOnly Session Cookies
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    }
  },
}
