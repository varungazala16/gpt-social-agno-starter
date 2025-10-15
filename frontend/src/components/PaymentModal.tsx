'use client'

import { CreditCard, Coins, Star, Zap, ExternalLink } from 'lucide-react'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  creditsRequired?: number
  creditsAvailable?: number
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  creditsRequired, 
  creditsAvailable 
}: PaymentModalProps) {
  const handleUpgrade = () => {
    // TODO: Implement Stripe checkout
    console.log('Opening Stripe checkout for credits')
  }

  const handleContactSupport = () => {
    // TODO: Implement support contact
    console.log('Opening support contact')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-gray-950 max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-600/20 rounded-full">
              <Coins className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Insufficient Credits</h2>
          <p className="text-gray-400">
            {creditsRequired && creditsAvailable !== null && creditsAvailable !== undefined ? (
              <>You need <span className="text-red-400 font-semibold">{creditsRequired.toLocaleString()}</span> credits, but only have <span className="text-yellow-400 font-semibold">{creditsAvailable.toLocaleString()}</span> available.</>
            ) : (
              <>You don&apos;t have enough credits to complete this operation.</>
            )}
          </p>
        </div>

        {/* Credit Packages */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Purchase Credits</h3>
              <p className="text-sm text-gray-400">Choose from our credit packages</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Starter Pack */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-white">Starter Pack</span>
                </div>
                <span className="text-lg font-bold text-white">$9</span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-yellow-400">1,000 credits</p>
                <p className="text-xs text-gray-400">Perfect for light usage</p>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Purchase
              </button>
            </div>

            {/* Popular Pack */}
            <div className="relative p-4 bg-purple-950/30 rounded-lg border-2 border-purple-600/50 hover:border-purple-500 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  POPULAR
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 mt-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">Pro Pack</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">$39</span>
                  <p className="text-xs text-purple-400">Save 35%</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-purple-400">6,000 credits</p>
                <p className="text-xs text-gray-400">Best value for regular users</p>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                Purchase
              </button>
            </div>

            {/* Business Pack */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors sm:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-white">Business Pack</span>
                  <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded">
                    Best Deal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">$99</span>
                  <p className="text-xs text-green-400">Save 50%</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-400 mb-2">20,000 credits</p>
                  <p className="text-xs text-gray-400">For power users and businesses</p>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleUpgrade}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Balance */}
        {creditsAvailable !== null && creditsAvailable !== undefined && (
          <div className="bg-yellow-950/20 rounded-lg border border-yellow-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-white">Current Balance</p>
                  <p className="text-xs text-gray-400">Your available credits</p>
                </div>
              </div>
              <span className="text-lg font-bold text-yellow-400">
                {creditsAvailable.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Need Help?</h3>
              <p className="text-sm text-gray-400">Questions about credits or billing</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContactSupport}
              className="w-full px-4 py-2 text-sm text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Contact Support
            </button>
            <p className="text-xs text-gray-500 text-center">
              Credits are processed instantly and never expire
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}