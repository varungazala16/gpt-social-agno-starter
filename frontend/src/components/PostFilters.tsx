'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PostStatus } from '@/actions/post'

interface PostFiltersProps {
  onFilterChange: (filters: {
    status?: PostStatus
    search?: string
    from?: string
    to?: string
  }) => void
}

export function PostFilters({ onFilterChange }: PostFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState<PostStatus | ''>((searchParams.get('status') as PostStatus) || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters()
    }, 500)

    return () => clearTimeout(timer)
  }, [status, search, from, to])

  const updateFilters = () => {
    const filters: any = {}
    const params = new URLSearchParams()

    if (status) {
      filters.status = status
      params.set('status', status)
    }
    if (search) {
      filters.search = search
      params.set('search', search)
    }
    if (from) {
      filters.from = from
      params.set('from', from)
    }
    if (to) {
      filters.to = to
      params.set('to', to)
    }

    // Update URL
    const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts'
    router.push(newUrl, { scroll: false })

    // Notify parent
    onFilterChange(filters)
  }

  const clearFilters = () => {
    setStatus('')
    setSearch('')
    setFrom('')
    setTo('')
    router.push('/posts', { scroll: false })
    onFilterChange({})
  }

  const hasFilters = status || search || from || to

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Published</option>
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search captions..."
              className="pl-10"
            />
          </div>
        </div>

        {/* From Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">From Date</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* To Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">To Date</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
