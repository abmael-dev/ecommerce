import { type FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from './env.js'

/**
 * Configura Swagger/OpenAPI 3.0 com documentação completa.
 * Disponível apenas em desenvolvimento para não expor a API em produção.
 */
export async function registerSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: env.APP_NAME,
        description: `
# E-Commerce API

Backend profissional de e-commerce de roupas, tênis e calçados.

## Autenticação

Esta API usa **JWT + Refresh Token Rotativo** via **HttpOnly Cookies**.

### Fluxo de autenticação:
1. \`POST /api/v1/auth/login\` → recebe access token (15min) + refresh token (7d) nos cookies
2. Requisições autenticadas enviam o access token no header: \`Authorization: Bearer <token>\`
3. Quando o access token expira, use \`POST /api/v1/auth/refresh\` para obter um novo par
4. \`POST /api/v1/auth/logout\` revoga o refresh token atual

## Segurança

- Todas as entradas são validadas com Zod
- Rate limiting em todas as rotas sensíveis
- Proteção CSRF via double-submit cookie
- Senhas hasheadas com Argon2id
- SQL Injection prevenido via Prisma parameterizado
        `.trim(),
        version: '1.0.0',
        contact: {
          name: 'E-Commerce API Support',
          email: 'api@ecommerce.com',
        },
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: `${env.APP_URL}/api/${env.API_VERSION}`,
          description: env.NODE_ENV === 'production' ? 'Production' : 'Development',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Access Token JWT (expira em 15 minutos)',
          },
          CookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refresh_token',
            description: 'Refresh Token HttpOnly Cookie',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  details: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
          PaginationMeta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 20 },
              total: { type: 'integer', example: 100 },
              totalPages: { type: 'integer', example: 5 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Autenticação e gerenciamento de sessões' },
        { name: 'Users', description: 'Gerenciamento de usuários' },
        { name: 'Categories', description: 'Categorias de produtos' },
        { name: 'Brands', description: 'Marcas de produtos' },
        { name: 'Products', description: 'Catálogo de produtos' },
        { name: 'Cart', description: 'Carrinho de compras' },
        { name: 'Orders', description: 'Pedidos' },
        { name: 'Addresses', description: 'Endereços de entrega' },
        { name: 'Reviews', description: 'Avaliações de produtos' },
        { name: 'Health', description: 'Monitoramento e health checks' },
      ],
    },
  })

  // UI do Swagger — apenas em desenvolvimento
  if (env.NODE_ENV !== 'production') {
    await app.register(swaggerUi, {
      routePrefix: `/api/${env.API_VERSION}/docs`,
      uiConfig: {
        docExpansion: 'tag',
        deepLinking: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    })
  }
}
