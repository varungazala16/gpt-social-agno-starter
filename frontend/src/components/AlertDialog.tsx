'use client'

import { Modal } from './Modal'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: 'info' | 'error' | 'success'
}

export function AlertDialog({ isOpen, onClose, title = 'Alert', message }: AlertDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="p-4">
        <p className="text-sm">{message}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600"
        >
          OK
        </button>
      </div>
    </Modal>
  )
}
