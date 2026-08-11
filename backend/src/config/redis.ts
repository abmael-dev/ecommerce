import Redis from 'ioredis'
import { env } from './env.js'
import { createLogger } from './logger.js'

const log = createLogger('Redis')

let redisInstance: Redis | null = null

/**
 * Retorna o cliente Redis singleton.
 * Lazy initialization — só conecta quando necessário.
 */
export function getRedisClient(): Redis {
  if (redisInstance !== null) {
    return redisInstance
  }

  redisInstance = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
    lazyConnect: false,
    tls: env.REDIS_TLS ? {} : undefined,
    retryStrategy(times) {
      if (times > 5) {
        log.error({ times }, 'Redis: máximo de reconexões atingido, encerrando')
        return null // Para de tentar reconectar
      }
      const delay = Math.min(times * 500, 5000)
      log.warn({ times, delay }, 'Redis: reconectando...')
      return delay
    },
    reconnectOnError(err) {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ECONNREFUSED']
      if (targetErrors.some((e) => err.message.includes(e))) {
        return true
      }
      return false
    },
  })

  redisInstance.on('connect', () => {
    log.info('Redis: conectado')
  })

  redisInstance.on('ready', () => {
    log.info('Redis: pronto para comandos')
  })

  redisInstance.on('error', (err) => {
    log.error({ err }, 'Redis: erro de conexão')
  })

  redisInstance.on('close', () => {
    log.warn('Redis: conexão fechada')
  })

  return redisInstance
}

/**
 * Fecha a conexão Redis graciosamente.
 */
export async function closeRedis(): Promise<void> {
  if (redisInstance !== null) {
    await redisInstance.quit()
    redisInstance = null
    log.info('Redis: conexão encerrada graciosamente')
  }
}

/**
 * Verifica se o Redis está disponível (health check).
 */
export async function pingRedis(): Promise<boolean> {
  try {
    const client = getRedisClient()
    const response = await client.ping()
    return response === 'PONG'
  } catch {
    return false
  }
}
