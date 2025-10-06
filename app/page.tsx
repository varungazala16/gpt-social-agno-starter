'use client'

import { useState } from 'react'
import { Upload, Video, Library } from 'lucide-react'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoRecorder } from '@/components/VideoRecorder'
import { VideoGallery } from '@/components/VideoGallery'
import { VideoEditor } from '@/components/VideoEditor'
import { cn } from '@/lib/utils'

type Tab = 'upload' | 'record' | 'gallery'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('gallery')
  }

  const handleRecordingComplete = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('gallery')
  }

  const handleEditVideo = (url: string) => {
    setSelectedVideoForEdit(url)
    setIsEditorOpen(true)
  }

  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setSelectedVideoForEdit(null)
  }

  const tabs = [
    { id: 'gallery' as Tab, label: 'Gallery', icon: Library },
    { id: 'upload' as Tab, label: 'Upload', icon: Upload },
    { id: 'record' as Tab, label: 'Record', icon: Video },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video Studio
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Play, upload, record, and edit your videos
          </p>
        </div>
      </header>

      {/* Mobile-first Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto -mb-px space-x-2 sm:space-x-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Video Gallery
                </h2>
                <button
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
              <VideoGallery refreshTrigger={refreshTrigger} onEditVideo={handleEditVideo} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Video
              </h2>
              <VideoUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {activeTab === 'record' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Record Video
              </h2>
              <VideoRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}
        </div>
      </main>

      {/* Video Editor Modal */}
      {selectedVideoForEdit && (
        <VideoEditor
          src={selectedVideoForEdit}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js 15.5, Tailwind CSS, and Preline UI
          </p>
        </div>
      </footer>
    </div>
  )
}
