import { StaffLayout } from '../../components/staff/layout'
import { MapPin, Clock, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Pagination } from '@/components/ui/pagination'
import { usePosts } from '@/hooks/use-post'
import type { PostTypeFilter } from '@/types/post.types'
import type { Post } from '@/types/post.types'
import { Spinner } from '@/components/ui/spinner'

export interface SearchResultsSearch {
  q?: string
  postType?: PostTypeFilter
  page?: number
}

const pageSize = 10

export function SearchResultsPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as SearchResultsSearch
  const searchTerm = searchParams?.q ?? ''
  const postType = (searchParams?.postType as PostTypeFilter) ?? 'All'
  const currentPage = searchParams?.page ?? 1

  const { data, isLoading, isError } = usePosts({
    searchTerm,
    postType,
    page: currentPage,
    pageSize,
  })

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

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

  const postWithScore = (p: Post): p is Post & { similarityScore?: number } =>
    'similarityScore' in p && typeof (p as Post & { similarityScore?: number }).similarityScore === 'number'

  return (
    <StaffLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link to="/console/staff/inventory" className="hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/console/staff/inventory" className="hover:text-gray-900 transition-colors">
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Search Results</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            {searchTerm && (
              <p className="text-gray-600 mt-1">
                Kết quả tìm kiếm theo &quot;{searchTerm}&quot; (semantic search)
              </p>
            )}
          </div>

          {isError && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tải được kết quả tìm kiếm.</p>
            </div>
          )}

          {!isError && (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {totalCount > 0
                  ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} results`
                  : searchTerm
                    ? 'No posts match your search.'
                    : 'Enter a search term to find posts.'}
              </div>

              {isLoading ? (
                <div className="py-12">
                  <Spinner className="mx-auto" />
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {items.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex gap-6"
                    >
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {post.imageUrls?.[0] ? (
                          <img
                            src={post.imageUrls[0]}
                            alt={post.itemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeBadgeClass(post.postType)}`}
                            >
                              {post.postType}
                            </span>
                          </div>
                          {postWithScore(post) && post.similarityScore != null && (
                            <div className="text-right flex-shrink-0">
                              <div className="text-xl font-bold text-blue-600">
                                {Math.round(post.similarityScore * 100)}%
                              </div>
                              <div className="text-xs text-gray-500">Match</div>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{post.itemName}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{post.displayAddress || 'Unknown location'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>Posted {formatPosted(post.createdAt)}</span>
                          </div>
                        </div>
                        <Link to="/console/staff/item/$itemId" params={{ itemId: post.id }}>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      navigate({
                        to: '/console/staff/inventory-search',
                        search: {
                          q: searchTerm || undefined,
                          postType: postType !== 'All' ? postType : undefined,
                          page: page > 1 ? page : undefined,
                        },
                      })
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StaffLayout>
  )
}
