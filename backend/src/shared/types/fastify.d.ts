import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * ID do usuário autenticado (injetado pelo auth middleware).
     * Sempre proveniente do JWT verificado — nunca do body/query.
     */
    userId: string

    /**
     * Role do usuário autenticado.
     * Sempre revalidado no banco — nunca confia no token JWT diretamente.
     */
    userRole: 'CLIENT' | 'ADMIN'

    /**
     * IP real do cliente (com suporte a proxy reverso).
     */
    realIp: string
  }
}
