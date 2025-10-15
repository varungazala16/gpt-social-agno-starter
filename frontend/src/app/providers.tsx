'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/query-client'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import { PaymentModalProvider } from '@/components/PaymentModalProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <PaymentModalProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </PaymentModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
