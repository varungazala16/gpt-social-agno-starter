'use client';

import * as React from 'react';
import { Trash2, Edit, Film, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

export interface CardPostProps {
  id: string;
  title?: string | null;
  caption?: string | null;
  status?: 'draft' | 'scheduled' | 'posted';
  videoUrl?: string | null;
  videoCount?: number;
  createdAt?: string;
  publishedAt?: string | null;
  thumbnail?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isDeleting?: boolean;
  className?: string;
}

function getStatusColor(status: CardPostProps['status']) {
  switch (status) {
    case 'posted':
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800';
    case 'scheduled':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800';
    case 'draft':
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700';
  }
}

/**
 * CardPost Component
 *
 * Specialized card for displaying video posts
 * Features: status badge, video count, edit/delete actions
 * Mobile-first with responsive layout
 */
export function CardPost({
  caption,
  status = 'draft',
  videoCount = 0,
  createdAt,
  publishedAt,
  thumbnail,
  onEdit,
  onDelete,
  onClick,
  isDeleting = false,
  className,
}: CardPostProps) {
  const postDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : 'Unknown date';

  return (
    <Card
      variant="default"
      hover
      className={cn('group relative', className)}
    >
      {/* Status Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border',
            getStatusColor(status)
          )}
        >
          <span className="capitalize">{status}</span>
        </div>
      </div>

      {/* Video Count Badge */}
      {videoCount > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            <Film className="w-3 h-3" />
            <span>{videoCount}</span>
          </div>
        </div>
      )}

      {/* Thumbnail/Preview */}
      <div
        className={cn(
          'relative aspect-video bg-gray-100 dark:bg-gray-800',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        {thumbnail ? (
          thumbnail
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {caption ? (
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {caption}
              </p>
            ) : (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                No caption
              </p>
            )}

            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{postDate}</span>
            </div>

            {publishedAt && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>Published: {new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={onEdit}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2',
                  'bg-primary hover:bg-primary/90 text-white',
                  'rounded-md text-sm font-medium transition-smooth',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'dark:focus-visible:ring-offset-gray-900'
                )}
                aria-label="Edit post"
                title="Edit post"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2',
                  'bg-transparent text-negative hover:bg-negative/10',
                  'border border-negative/20 hover:border-negative',
                  'rounded-md text-sm font-medium transition-smooth',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-negative focus-visible:ring-offset-2',
                  'dark:focus-visible:ring-offset-gray-900',
                  isDeleting && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Delete post"
                title="Delete post"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-negative border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

CardPost.displayName = 'CardPost';
