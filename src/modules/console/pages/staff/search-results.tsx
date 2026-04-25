import { StaffLayout } from '../../components/staff/layout'
import { Archive, Clock, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useSearch, useParams } from '@tanstack/react-router'
import { Pagination } from '@/components/ui/pagination'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'
import { useSubcategories } from '@/hooks/use-subcategories'
import { getInventoryDescription, getInventoryTitle } from '@/utils/inventory-view'

export interface SearchResultsSearch {
  q?: string
  page?: number
}

const pageSize = 10

export function SearchResultsPage() {
  const navigate = useNavigate()
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const searchParams = useSearch({ strict: false }) as SearchResultsSearch
  const searchTerm = searchParams?.q ?? ''
  const currentPage = searchParams?.page ?? 1

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, {
    query: searchTerm,
    page: currentPage,
    pageSize,
  })
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})

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

  const statusBadgeClass = (s: string) => {
    switch (s) {
      case 'Active':
        return 'bg-[#ff385c] text-white'
      case 'InStorage':
        return 'bg-[#222222] text-white'
      case 'ReturnScheduled':
        return 'bg-[#c97a00] text-white'
      case 'Returned':
        return 'bg-[#06c167] text-white'
      case 'Archived':
        return 'bg-[#6a6a6a] text-white'
      case 'Expired':
        return 'bg-[#929292] text-white'
      default:
        return 'bg-[#929292] text-white'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'Active': return 'Active'
      case 'InStorage': return 'In Storage'
      case 'ReturnScheduled': return 'Return Scheduled'
      case 'Returned': return 'Returned'
      case 'Archived': return 'Archived'
      case 'Expired': return 'Expired'
      default: return s
    }
  }

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#6a6a6a]">
            <Link
              to="/console/$slug/staff/inventory"
              params={{ slug }}
              className="hover:text-[#222222] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/console/$slug/staff/inventory"
              params={{ slug }}
              className="hover:text-[#222222] transition-colors"
            >
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#222222] font-medium">Search Results</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#222222]">Search Results</h1>
            {searchTerm && (
              <p className="text-[#6a6a6a] mt-1">
                Kết quả tìm kiếm theo &quot;{searchTerm}&quot;
              </p>
            )}
          </div>

          {isError && (
            <div className="text-center py-12">
              <p className="text-[#929292] text-lg">Không tải được kết quả tìm kiếm.</p>
            </div>
          )}

          {!isError && (
            <>
              <div className="mb-4 text-sm text-[#6a6a6a]">
                {totalCount > 0
                  ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} results`
                  : searchTerm
                    ? 'No items match your search.'
                    : 'Enter a search term to find items.'}
              </div>

              {isLoading ? (
                <div className="py-12">
                  <Spinner className="mx-auto" />
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-[14px] border border-[#dddddd] p-6 hover:border-[#222222] transition-colors flex gap-6"
                    >
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-[#f7f7f7]">
                        {item.imageUrls?.[0] ? (
                          <img
                            src={item.imageUrls[0]}
                            alt={getInventoryTitle(item, subcategoryNameById)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#929292] text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(item.status)}`}
                            >
                              {statusLabel(item.status)}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-[#222222] mb-1">
                          {getInventoryTitle(item, subcategoryNameById)}
                        </h3>
                        <p className="text-sm text-[#6a6a6a] mb-3 line-clamp-2">
                          {getInventoryDescription(item) ?? '—'}
                        </p>
                        <div className="space-y-2 text-sm text-[#6a6a6a] mb-4">
                          <div className="flex items-center gap-2">
                            <Archive className="w-4 h-4 flex-shrink-0" />
                            <span>{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>Added {formatPosted(item.createdAt)}</span>
                          </div>
                        </div>
                        <Link
                          to="/console/$slug/staff/item/$itemId"
                          params={{ slug, itemId: item.id }}
                        >
                          <button className="px-4 py-2 border border-[#dddddd] text-[#6a6a6a] rounded-[20px] hover:bg-[#f7f7f7] transition-all font-medium text-sm active:scale-[0.92]">
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
                        to: '/console/$slug/staff/inventory-search',
                        params: { slug },
                        search: {
                          q: searchTerm || undefined,
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
