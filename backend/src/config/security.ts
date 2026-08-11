import { type FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import { env } from './env.js'

/**
 * Configura todas as proteções de segurança HTTP:
 * - Helmet (headers de segurança)
 * - CSP (Content Security Policy)
 * - HSTS
 * - CORS restritivo
 * - Remove X-Powered-By
 */
export async function registerSecurity(app: FastifyInstance): Promise<void> {
  // ─── CORS ────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: (origin, cb) => {
      // Permite apenas origens explicitamente configuradas
      const allowedOrigins = [env.CORS_ORIGIN, env.FRONTEND_URL].filter(Boolean)

      if (origin === undefined || allowedOrigins.includes(origin)) {
        cb(null, true)
        return
      }

      cb(new Error('Not allowed by CORS'), false)
    },
    credentials: env.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID'],
    exposedHeaders: ['X-Total-Count', 'X-Total-Pages'],
    maxAge: 86400, // 24h preflight cache
  })

  // ─── HELMET (Headers de segurança) ────────────────────────────────────────
  await app.register(helmet, {
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"], // Proteção Clickjacking
        formAction: ["'self'"],
        upgradeInsecureRequests:
          env.NODE_ENV === 'production' ? [] : null,
        blockAllMixedContent: env.NODE_ENV === 'production' ? [] : null,
      },
    },
    // HSTS — força HTTPS por 1 ano com preload
    hsts:
      env.NODE_ENV === 'production'
        ? {
            maxAge: 31536000, // 1 ano
            includeSubDomains: true,
            preload: true,
          }
        : false,
    // Remove X-Powered-By
    hidePoweredBy: true,
    // Previne MIME type sniffing
    noSniff: true,
    // Previne Clickjacking
    frameguard: { action: 'deny' },
    // XSS Filter
    xssFilter: true,
    // Referrer Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Permissions Policy
    permittedCrossDomainPolicies: false,
    crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
  })
}
