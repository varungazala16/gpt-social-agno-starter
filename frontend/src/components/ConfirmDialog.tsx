'use client'

import { Modal } from './Modal'
import { AlertTriangle, Info } from 'lucide-react'
import { Button } from './ui/button'

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
  variant = 'info'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />,
          iconBg: 'bg-red-100 dark:bg-red-950',
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
          iconBg: 'bg-yellow-100 dark:bg-yellow-950',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          iconBg: 'bg-blue-100 dark:bg-blue-950',
          confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-2 rounded-lg ${variantStyles.iconBg}`}>
            {variantStyles.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={variantStyles.confirmClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
