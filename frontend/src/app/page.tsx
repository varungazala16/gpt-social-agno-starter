'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Video, Library, Settings } from 'lucide-react'
import { VideoUpload } from '@/components/VideoUpload'
import { VideoRecorder } from '@/components/VideoRecorder'
import { VideoGallery } from '@/components/VideoGallery'
import { VideoEditor } from '@/components/VideoEditor'
import { UserProfile } from '@/components/UserProfile'
import { CreditsDisplay } from '@/components/CreditsDisplay'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Sidebar Header */}
          <div className="flex flex-col px-6 py-6">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Video Studio
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Play, upload, record, and edit your videos
            </p>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </Button>
              )
            })}
          </nav>

          <Separator />

          {/* User Section */}
          <div className="px-4 py-4 space-y-3">
            {/* Credits Display */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CreditsDisplay />
            </div>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            
            {/* User Profile Section */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <UserProfile />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Video Studio
            </h1>
            <div className="flex items-center gap-2">
              <CreditsDisplay />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/settings')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <UserProfile />
            </div>
          </div>
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 flex-1",
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 dark:text-gray-400"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      </div>

      {/* Video Editor Modal */}
      {selectedVideoForEdit && (
        <VideoEditor
          src={selectedVideoForEdit}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSaveComplete={handleSaveComplete}
        />
      )}

    </div>
  )
}
