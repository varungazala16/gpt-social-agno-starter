'use client'

import { useState } from 'react'
import { Upload, Video, Film, Library } from 'lucide-react'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoRecorder } from '@/components/VideoRecorder'
import { VideoGallery } from '@/components/VideoGallery'
import { VideoEditor } from '@/components/VideoEditor'
import { cn } from '@/lib/utils'

type Tab = 'upload' | 'record' | 'edit' | 'gallery'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState<string | null>(null)

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
    setActiveTab('edit')
  }

  const tabs = [
    { id: 'gallery' as Tab, label: 'Gallery', icon: Library },
    { id: 'upload' as Tab, label: 'Upload', icon: Upload },
    { id: 'record' as Tab, label: 'Record', icon: Video },
    { id: 'edit' as Tab, label: 'Edit', icon: Film },
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

          {activeTab === 'edit' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Video
              </h2>
              
              {!selectedVideoForEdit ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <Film className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a video from the gallery to edit
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedVideoForEdit(null)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                  >
                    ← Back to selection
                  </button>
                  <VideoEditor src={selectedVideoForEdit} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

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
