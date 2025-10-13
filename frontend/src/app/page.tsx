'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Video, Library, Settings } from 'lucide-react'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoRecorder } from '@/components/VideoRecorder'
import { VideoGallery } from '@/components/VideoGallery'
import { VideoEditor } from '@/components/VideoEditor'
import { UserProfile } from '@/components/UserProfile'
import { cn } from '@/lib/utils'

type Tab = 'upload' | 'record' | 'gallery'

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('gallery')
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleUploadSuccess = () => {
    setActiveTab('gallery')
  }

  const handleRecordingComplete = () => {
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

  const handleSaveComplete = () => {
    // React Query will auto-invalidate and refetch videos
  }

  const tabs = [
    { id: 'gallery' as Tab, label: 'Gallery', icon: Library },
    { id: 'upload' as Tab, label: 'Upload', icon: Upload },
    { id: 'record' as Tab, label: 'Record', icon: Video },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Video Studio
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Play, upload, record, and edit your videos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-first Tab Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto -mb-px space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'gallery' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Video Gallery
              </h2>
              <VideoGallery onEditVideo={handleEditVideo} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Upload Video
              </h2>
              <VideoUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {activeTab === 'record' && (
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
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
          onSaveComplete={handleSaveComplete}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js 15.5, Tailwind CSS, and Preline UI
          </p>
        </div>
      </footer>
    </div>
  )
}
