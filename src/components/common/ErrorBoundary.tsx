import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React ErrorBoundary error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 shadow-lg shadow-red-500/10">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Algo deu errado na exibição da página</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-2 mb-6">
            Ocorreu uma falha inesperada de renderização. Nenhuma informação de cartão de crédito ou dado sensível foi afetado.
          </p>
          <Button variant="primary" onClick={this.handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Recarregar Aplicação
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
