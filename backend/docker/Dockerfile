# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production=false

# Copiar código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Gerar Prisma Client
RUN npx prisma generate

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Instalar apenas dependências de runtime
RUN apk add --no-cache dumb-init

# Usuário não-root (segurança)
RUN addgroup -g 1001 -S nodejs && adduser -S ecommerce -u 1001

# Copiar do builder
COPY --from=builder --chown=ecommerce:nodejs /app/dist ./dist
COPY --from=builder --chown=ecommerce:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=ecommerce:nodejs /app/package*.json ./
COPY --from=builder --chown=ecommerce:nodejs /app/prisma ./prisma

# Criar diretórios necessários
RUN mkdir -p src/uploads src/logs && chown -R ecommerce:nodejs src/

# Variáveis de ambiente de runtime
ENV NODE_ENV=production
ENV PORT=3000

USER ecommerce

EXPOSE 3000

# dumb-init para signal handling correto
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
