'use client'

import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm', 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning'
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  }

  const confirmButtonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className={`p-4 border rounded-lg ${variantStyles[variant]}`}>
        <p className="text-sm">{message}</p>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 ${confirmButtonStyles[variant]} text-white rounded-lg font-medium transition-colors`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
