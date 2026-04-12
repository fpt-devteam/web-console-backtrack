import { StaffLayout } from '../../components/staff'
import { Calendar, Download, Plus, Search, Archive } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { Link,  useParams } from '@tanstack/react-router'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryPost, PostStatus, ItemCategory } from '@/services/inventory.service'
import { useDebouncedValue } from '@/hooks/use-debounce'

const pageSize = 8

const ALL_STATUS = 'All' as const
type StatusFilter = typeof ALL_STATUS | PostStatus
type CategoryFilter = typeof ALL_STATUS | ItemCategory

export function StaffInventoryPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  
  const [searchTerm, setSearchTerm] = useState('')
  // Mặc định load trang staff trả về InStorage
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('InStorage')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(ALL_STATUS)
  const [colorFilter, setColorFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 500)
  const debouncedColor = useDebouncedValue(colorFilter.trim(), 500)
  const debouncedBrand = useDebouncedValue(brandFilter.trim(), 500)

  const listParams = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      query: debouncedSearch || undefined,
      status: statusFilter !== ALL_STATUS ? statusFilter : undefined,
      category: categoryFilter !== ALL_STATUS ? categoryFilter : undefined,
      color: debouncedColor || undefined,
      brand: debouncedBrand || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [currentPage, debouncedSearch, statusFilter, categoryFilter, debouncedColor, debouncedBrand, fromDate, toDate],
  )

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, listParams)

  const items: InventoryPost[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, categoryFilter, debouncedColor, debouncedBrand, fromDate, toDate])

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
      case 'InStorage': return 'bg-indigo-500 text-white'
      case 'Active': return 'bg-blue-600 text-white'
      case 'ReturnScheduled': return 'bg-amber-500 text-white'
      case 'Returned': return 'bg-green-500 text-white'
      case 'Archived': return 'bg-slate-600 text-white'
      case 'Expired': return 'bg-gray-600 text-white'
      default: return 'bg-gray-600 text-white'
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
      <div className="p-4 sm:p-4 lg:p-6 min-h-screen sm:mx-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inventory Dashboard
            </h1>
            <p className="text-gray-600 text-xs sm:text-base">
              Manage lost and found items. Search by item name or details.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link to="/console/$slug/staff/inventory-add-item" params={{ slug }} className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm sm:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add found item</span>
                <span className="sm:hidden">Add Item</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Filters Section (inline wrapping layout) */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-6 text-sm">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name/details..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md px-2 py-1">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-gray-900 w-[115px]"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-gray-900 w-[115px]"
            />
          </div>

          <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

          {/* Dropdowns & Text filters */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium whitespace-nowrap">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-2 pr-6 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[140px] text-ellipsis bg-white text-gray-900"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="InStorage">In Storage</option>
              <option value="ReturnScheduled">Return Sched</option>
              <option value="Returned">Returned</option>
              <option value="Archived">Archived</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium whitespace-nowrap">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="pl-2 pr-6 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[130px] text-ellipsis bg-white text-gray-900"
            >
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Documents">Documents</option>
              <option value="Wallet">Wallet</option>
              <option value="Suitcase">Suitcase</option>
              <option value="Bags">Bags</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium whitespace-nowrap">Color</span>
            <input
              type="text"
              placeholder="e.g. Red"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-20 pl-2 pr-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium whitespace-nowrap">Brand</span>
            <input
              type="text"
              placeholder="e.g. Apple"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-24 pl-2 pr-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Clear filters trigger */}
          {(searchTerm || statusFilter !== 'InStorage' || categoryFilter !== ALL_STATUS || colorFilter || brandFilter || fromDate || toDate) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('InStorage')
                setCategoryFilter(ALL_STATUS)
                setColorFilter('')
                setBrandFilter('')
                setFromDate('')
                setToDate('')
              }}
              className="text-blue-600 hover:underline ml-auto font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {totalCount > 0
              ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} items`
              : 'No items'}
          </span>
        </div>

        {isError && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Failed to load inventory items.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12">
              <Spinner className="mx-auto" />
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                No items found matching your filters.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
                  {item.imageUrls?.[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.item.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">{item.item.itemName}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5 min-h-[40px]">
                    {(() => {
                      const d = item.item.additionalDetails?.trim()
                      if (!d || d === '—' || d === '-') return ''
                      return d
                    })()}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 flex-shrink-0" />
                      <span>{item.item.category || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{item.eventTime ? new Date(item.eventTime).toLocaleDateString() : formatPosted(item.createdAt)}</span>
                    </div>
                  </div>
                  <Link to="/console/$slug/staff/item/$itemId" params={{ slug, itemId: item.id }} className="mt-auto block">
                    <button className="w-full py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading && totalCount > pageSize && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </StaffLayout>
  )
}
