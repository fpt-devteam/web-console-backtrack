import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useUser } from '@/hooks/use-user'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { Search, Calendar, Archive } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Pagination } from '@/components/ui/pagination'
import type { InventoryPost } from '@/services/inventory.service'

const pageSize = 8

function statusBadgeClass(s: string) {
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

function statusLabel(s: string) {
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

export function HandoverHistory() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const { data: user } = useUser()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 500)

  const listParams = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      query: debouncedSearch || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      returnStaffId: user?.id,
    }),
    [currentPage, debouncedSearch, fromDate, toDate, user?.id],
  )

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, listParams)

  const items: InventoryPost[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, fromDate, toDate])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm">
        <div className="relative min-w-[200px] flex-1 lg:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search returned items..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          />
        </div>

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

        {(searchTerm || fromDate || toDate) && (
          <button
            onClick={() => {
              setSearchTerm('')
              setFromDate('')
              setToDate('')
            }}
            className="text-blue-600 hover:underline ml-auto font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Failed to load handover history.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12">
            <Spinner className="mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No handover history found matching your filters.</p>
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
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 flex-shrink-0" />
                    <span>{item.item.category || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{item.eventTime ? new Date(item.eventTime).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}</span>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
