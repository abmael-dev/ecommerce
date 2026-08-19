import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Global Axios Instance - Zero-Trust Configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.ecommerce.example.com/v1',
  withCredentials: true, // MANDATORY: Sends HttpOnly session cookies automatically
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // SECURITY: We explicitly DO NOT read or attach tokens from LocalStorage/SessionStorage.
    // Auth is managed securely via browser HttpOnly cookies.
    return config
  },
  (error) => Promise.reject(error)
)

// Global Unauthorized/Refresh Queue Management
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Global Custom Error Event for Toast/Notification Integration
export interface ApiUserError {
  message: string
  status?: number
  code?: string
}

export const dispatchApiError = (friendlyMessage: string, status?: number) => {
  const event = new CustomEvent<ApiUserError>('api-error', {
    detail: { message: friendlyMessage, status },
  })
  window.dispatchEvent(event)
}

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!error.response) {
      // Rejeita silenciosamente para permitir que o fallback local dos serviços funcione sem avisos de erro de servidor na tela
      return Promise.reject(error)
    }

    const status = error.response.status

    // Handle 401 Unauthorized - Silent Cookie Refresh Flow
    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        // Refresh or Login failed - redirect to login without loop
        dispatchApiError('Sessão expirada. Por favor, faça login novamente.', 401)
        window.dispatchEvent(new Event('auth-logout'))
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // Call refresh endpoint with HttpOnly cookie credentials
        await api.post('/auth/refresh')
        processQueue(null)
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError)
        dispatchApiError('Sessão encerrada por inatividade. Faça login novamente.', 401)
        window.dispatchEvent(new Event('auth-logout'))
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      const msg = 'Você não possui permissão para realizar esta ação.'
      dispatchApiError(msg, 403)
      return Promise.reject(new Error(msg))
    }

    // Handle 422 / Validation Errors from Server
    if (status === 422 || status === 400) {
      const responseData = error.response.data as { message?: string; errors?: Record<string, string[]> }
      const friendlyMsg = responseData?.message || 'Dados inválidos. Por favor, revise as informações fornecidas.'
      dispatchApiError(friendlyMsg, status)
      return Promise.reject(error)
    }

    // Handle 500+ Internal Server Error - Sanitized Friendly Message (No Raw Traces)
    if (status >= 500) {
      const serverErrorMsg = 'Ocorreu um erro interno em nossos servidores. Nossa equipe já foi notificada.'
      dispatchApiError(serverErrorMsg, status)
      return Promise.reject(new Error(serverErrorMsg))
    }

    return Promise.reject(error)
  }
)
