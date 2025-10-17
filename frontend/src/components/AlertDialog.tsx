'use client'

import { Modal } from './Modal'
import { Button } from './ui/button'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: 'info' | 'error' | 'success'
}

export function AlertDialog({ isOpen, onClose, message }: AlertDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md rounded-lg shadow-xl">
      <div className="p-4">
        <p className="text-sm text-gray-900 dark:text-gray-100">{message}</p>
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  )
}
