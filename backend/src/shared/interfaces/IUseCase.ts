/**
 * Interface genérica de Use Case.
 * Garante que todo use case tem um método execute com tipagem forte.
 */
export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>
}

/**
 * Use Case sem parâmetros de entrada.
 */
export interface IUseCaseNoInput<TResponse> {
  execute(): Promise<TResponse>
}

/**
 * Use Case sem retorno.
 */
export interface IUseCaseNoOutput<TRequest> {
  execute(request: TRequest): Promise<void>
}
