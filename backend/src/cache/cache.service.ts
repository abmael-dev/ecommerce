import { getRedisClient } from '../config/redis.js'
import { createLogger } from '../config/logger.js'

const log = createLogger('CacheService')

/**
 * TTLs padrão (em segundos) para diferentes recursos.
 */
export const CacheTTL = {
  CATEGORIES: 3600,      // 1 hora
  BRANDS: 3600,          // 1 hora
  PRODUCT_LIST: 300,     // 5 minutos
  PRODUCT_DETAIL: 600,   // 10 minutos
  USER_SESSION: 900,     // 15 minutos (igual ao access token)
  RATE_LIMIT: 900,       // 15 minutos (janela de rate limit de auth)
  HEALTH: 30,            // 30 segundos
} as const

/**
 * Prefixos de chave para namespacing e fácil invalidação.
 */
export const CacheKeys = {
  categories: () => 'cache:categories:all',
  categorySlug: (slug: string) => `cache:categories:slug:${slug}`,
  brands: () => 'cache:brands:all',
  brandSlug: (slug: string) => `cache:brands:slug:${slug}`,
  productList: (params: string) => `cache:products:list:${params}`,
  productDetail: (slug: string) => `cache:products:detail:${slug}`,
  rateLimitAttempts: (ip: string, action: string) => `ratelimit:${action}:${ip}`,
  loginAttempts: (email: string) => `auth:attempts:${email}`,
  accountLock: (email: string) => `auth:lock:${email}`,
  resetToken: (tokenHash: string) => `auth:reset:${tokenHash}`,
  blacklistToken: (jti: string) => `auth:blacklist:${jti}`,
} as const

/**
 * Serviço de cache genérico sobre Redis.
 */
export class CacheService {
  private redis = getRedisClient()

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      if (value === null) return null
      return JSON.parse(value) as T
    } catch (err) {
      log.error({ err, key }, 'Cache get error')
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
    } catch (err) {
      log.error({ err, key }, 'Cache set error')
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (err) {
      log.error({ err, key }, 'Cache del error')
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      // SCAN em vez de KEYS para não bloquear o Redis
      const stream = this.redis.scanStream({ match: pattern, count: 100 })
      const pipeline = this.redis.pipeline()
      let hasKeys = false

      await new Promise<void>((resolve, reject) => {
        stream.on('data', (keys: string[]) => {
          if (keys.length > 0) {
            hasKeys = true
            for (const key of keys) {
              pipeline.del(key)
            }
          }
        })
        stream.on('end', resolve)
        stream.on('error', reject)
      })

      if (hasKeys) {
        await pipeline.exec()
      }
    } catch (err) {
      log.error({ err, pattern }, 'Cache delPattern error')
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (err) {
      log.error({ err, key }, 'Cache exists error')
      return false
    }
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    try {
      const count = await this.redis.incr(key)
      if (ttlSeconds !== undefined && count === 1) {
        await this.redis.expire(key, ttlSeconds)
      }
      return count
    } catch (err) {
      log.error({ err, key }, 'Cache incr error')
      return 0
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.expire(key, ttlSeconds)
    } catch (err) {
      log.error({ err, key }, 'Cache expire error')
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key)
    } catch (err) {
      log.error({ err, key }, 'Cache ttl error')
      return -1
    }
  }

  /**
   * Implementação de cache-aside com fallback automático.
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const fresh = await factory()
    await this.set(key, fresh, ttlSeconds)
    return fresh
  }
}
