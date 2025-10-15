'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { PaymentModal } from './PaymentModal'
import { APIError, setGlobalPaymentModalHandler } from '@/lib/api/client'
import { HttpStatus } from '@/lib/http-status'
import { useCredits } from '@/hooks/useCredits'

interface PaymentModalContextType {
  showPaymentModal: (error: APIError) => void
  hidePaymentModal: () => void
}

const PaymentModalContext = createContext<PaymentModalContextType | undefined>(undefined)

interface PaymentModalProviderProps {
  children: ReactNode
}

export function PaymentModalProvider({ children }: PaymentModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorDetails, setErrorDetails] = useState<{
    creditsRequired?: number
    creditsAvailable?: number
  }>({})
  
  const { balance } = useCredits()

  const showPaymentModal = useCallback((error: APIError) => {
    if (error.status === HttpStatus.PAYMENT_REQUIRED) {
      // Try to extract required credits from error message
      // Backend returns: "Not enough credits. Required: 1000000000, Available: 1000"
      const match = error.message.match(/Required: (\d+), Available: (\d+)/)
      if (match) {
        setErrorDetails({
          creditsRequired: parseInt(match[1]),
          creditsAvailable: parseInt(match[2])
        })
      } else {
        setErrorDetails({
          creditsAvailable: balance ?? undefined
        })
      }
      setIsOpen(true)
    }
  }, [balance])

  const hidePaymentModal = useCallback(() => {
    setIsOpen(false)
    setErrorDetails({})
  }, [])

  // Register the global payment modal handler
  useEffect(() => {
    setGlobalPaymentModalHandler(showPaymentModal)
    
    // Cleanup on unmount
    return () => {
      setGlobalPaymentModalHandler(() => {})
    }
  }, [showPaymentModal])

  return (
    <PaymentModalContext.Provider value={{ showPaymentModal, hidePaymentModal }}>
      {children}
      <PaymentModal
        isOpen={isOpen}
        onClose={hidePaymentModal}
        creditsRequired={errorDetails.creditsRequired}
        creditsAvailable={errorDetails.creditsAvailable}
      />
    </PaymentModalContext.Provider>
  )
}

export function usePaymentModal() {
  const context = useContext(PaymentModalContext)
  if (context === undefined) {
    throw new Error('usePaymentModal must be used within a PaymentModalProvider')
  }
  return context
}