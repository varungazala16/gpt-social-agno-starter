'use client'

import { Modal } from './Modal'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: 'info' | 'error' | 'success'
}

export function AlertDialog({ isOpen, onClose, title = 'Alert', message, variant = 'info' }: AlertDialogProps) {
  const variantStyles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className={`p-4 border rounded-lg ${variantStyles[variant]}`}>
        <p className="text-sm">{message}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          OK
        </button>
      </div>
    </Modal>
  )
}
