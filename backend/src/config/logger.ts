import pino from 'pino'
import { env } from './env.js'

/**
 * Logger estruturado com Pino.
 * Em produção: JSON puro (para ingestão em ELK/Loki).
 * Em desenvolvimento: pretty-print colorido.
 *
 * Redação automática de campos sensíveis (senhas, tokens, etc.).
 */
const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.passwordHash',
  'req.body.currentPassword',
  'req.body.newPassword',
  'req.body.token',
  'req.body.refreshToken',
  'res.headers["set-cookie"]',
  '*.password',
  '*.passwordHash',
  '*.token',
  '*.secret',
]

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
    messageFormat: '[{context}] {msg}',
  },
}

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      }
    },
    err: pino.stdSerializers.err,
  },
  ...(env.LOG_PRETTY && env.NODE_ENV !== 'production' ? { transport: devTransport } : {}),
  base: {
    service: env.APP_NAME,
    env: env.NODE_ENV,
    version: '1.0.0',
  },
})

/**
 * Cria um logger filho com contexto específico de módulo.
 */
export function createLogger(context: string): pino.Logger {
  return logger.child({ context })
}
