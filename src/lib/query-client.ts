import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
      retry: (failureCount, error: unknown) => {
        // Do not retry 401 or 403 errors
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 401 || status === 403 || status === 404) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
