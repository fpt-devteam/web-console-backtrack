import { StaffLayout } from '../../components/staff'
import { Calendar, Download, Plus, Search, Archive } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { Link, useNavigate } from '@tanstack/react-router'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryItem } from '@/services/inventory.service'

const pageSize = 8
/** Lấy đủ bản ghi để lọc + phân trang trên FE (không gọi API theo search). */
const fetchPageSize = 1000

function matchesSearch(item: InventoryItem, q: string): boolean {
  if (!q) return true
  const n = q.toLowerCase()
  const blob = [
    item.itemName,
    item.description,
    item.distinctiveMarks ?? '',
    item.storageLocation ?? '',
    item.finderContact?.name ?? '',
    item.finderContact?.email ?? '',
    item.finderContact?.phone ?? '',
    item.finderContact?.nationalId ?? '',
    item.finderContact?.orgMemberId ?? '',
  ]
    .join(' ')
    .toLowerCase()
  return blob.includes(n)
}

export function StaffInventoryPage() {
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)

  const listParams = useMemo(
    () => ({
      page: 1,
      pageSize: fetchPageSize,
      status: statusFilter !== 'All' ? statusFilter : undefined,
    }),
    [statusFilter],
  )

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, listParams)

  const allItems = data?.items ?? []

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim()
    if (!q) return allItems
    return allItems.filter((item) => matchesSearch(item, q))
  }, [allItems, searchTerm])

  const totalCount = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const items = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

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
      case 'InStorage':
        return 'bg-indigo-500 text-white'
      case 'Returned':
        return 'bg-green-500 text-white'
      case 'Disposed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'InStorage':
        return 'In Storage'
      case 'Returned':
        return 'Returned'
      case 'Disposed':
        return 'Disposed'
      default:
        return s
    }
  }

  return (
    <StaffLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen mx-0 sm:mx-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inventory Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage lost and found items. Search filters the list on this page (live).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link to="/console/staff/inventory-add-item" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm sm:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add found item</span>
                <span className="sm:hidden">Add Item</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                const q = searchTerm.trim()
                if (!q) return
                navigate({
                  to: '/console/staff/inventory-search',
                  search: { q },
                })
              }}
              placeholder="Search by name, description, location…"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium"
          >
            <option value="All">All</option>
            <option value="InStorage">In Storage</option>
            <option value="Returned">Returned</option>
            <option value="Disposed">Disposed</option>
          </select>
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
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No items found{searchTerm.trim() ? ` matching "${searchTerm.trim()}"` : ''}
              </p>
              {(searchTerm || statusFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('All')
                    setCurrentPage(1)
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {item.imageUrls?.[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.itemName}
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
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{item.itemName}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {item.finderContact?.name && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Finder:</span>
                        <span>{item.finderContact.name}</span>
                      </div>
                    )}
                    {item.storageLocation && (
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 flex-shrink-0" />
                        <span>{item.storageLocation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Added {formatPosted(item.createdAt)}</span>
                    </div>
                  </div>
                  <Link to="/console/staff/item/$itemId" params={{ itemId: item.id }}>
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
