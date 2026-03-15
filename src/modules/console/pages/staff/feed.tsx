import { StaffLayout } from '../../components/staff'
import { Plus, MapPin, Clock, Search } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { usePosts } from '@/hooks/use-post'
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce'
import type { PostTypeFilter } from '@/types/post.types'

export function StaffFeedPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS)
  const [postType, setPostType] = useState<PostTypeFilter>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  const { data, isLoading, isError } = usePosts({
    page: currentPage,
    pageSize,
    postType,
    searchTerm: debouncedSearchTerm || undefined,
  })

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const typeBadgeClass = (t: string) => {
    switch (t) {
      case 'Found':
        return 'bg-green-600 text-white'
      case 'Lost':
        return 'bg-amber-500 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const formatPosted = useMemo(() => {
    return (iso: string) => {
      try {
        const d = new Date(iso)
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      } catch {
        return iso
      }
    }
  }, [])

  return (
    <StaffLayout>
      <div className="p-8 min-h-screen mx-4">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Item Feed</h1>
          </div>
          <Link to="/console/staff/inventory-add-item">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
              <Plus className="w-5 h-5" />
              Add found item
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={postType}
              onChange={(e) => {
                setPostType(e.target.value as PostTypeFilter)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium"
            >
              <option value="All">All</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>
        </div>

        {isError && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Failed to load posts.</p>
          </div>
        )}

        {/* Items Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {isLoading ? (
            <div className="col-span-full py-12">
              <Spinner className="mx-auto" />
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts found{searchTerm.trim() ? ` matching "${searchTerm.trim()}"` : ''}
              </p>
            </div>
          ) : (
            items.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  {post.imageUrls?.[0] ? (
                    <img
                      src={post.imageUrls[0]}
                      alt={post.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold uppercase ${typeBadgeClass(
                      post.postType
                    )}`}
                  >
                    {post.postType}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.itemName}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{post.displayAddress || 'Unknown location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Posted {formatPosted(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <Link to="/console/staff/item/$itemId" params={{ itemId: post.id }}>
                    <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalCount > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} posts
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  )
}
