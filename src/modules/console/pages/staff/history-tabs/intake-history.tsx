import { useState, useMemo, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useUser } from '@/hooks/use-user'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { Pagination } from '@/components/ui/pagination'
import type { InventoryListItem, PostStatus } from '@/services/inventory.service'
import { InventoryStatusTabs } from '@/modules/console/components/inventory/inventory-status-tabs'
import { InventoryGridCards } from '@/modules/console/components/inventory/inventory-grid-cards'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSubcategories } from '@/hooks/use-subcategories'

const ALL_STATUS = 'All' as const
type StatusFilter = typeof ALL_STATUS | PostStatus
const pageSize = 8

export function IntakeHistory() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const { data: user } = useUser()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUS)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 500)

  const listParams = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      query: debouncedSearch || undefined,
      status: statusFilter !== ALL_STATUS ? statusFilter : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      staffId: user?.id,
    }),
    [currentPage, debouncedSearch, statusFilter, fromDate, toDate, user?.id],
  )

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, listParams)

  const items: InventoryListItem[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, fromDate, toDate])

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setToDate(fromDate)
    }
  }, [fromDate, toDate])

  return (
    <div className="space-y-6">
      <InventoryStatusTabs value={statusFilter} onChange={setStatusFilter} />

      <div className="text-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search intake items..."
              className="w-full pl-9 border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
            />
          </div>

          <div className="w-full md:w-1/2 flex items-center gap-2">
            <Input
              type="date"
              lang="vi-VN"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
              className="w-full border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
            />
            <span className="text-[#929292] px-1">to</span>
            <Input
              type="date"
              lang="vi-VN"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="w-full border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
            />
          </div>

          {(searchTerm || statusFilter !== ALL_STATUS || fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter(ALL_STATUS)
                setFromDate('')
                setToDate('')
              }}
              className="text-[#c13515] font-medium transition-all hover:scale-[1.03] hover:drop-shadow-sm md:ml-auto"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <InventoryGridCards
        items={items}
        isLoading={isLoading}
        isError={isError}
        subcategoryNameById={subcategoryNameById}
        emptyText="No intake history found matching your filters."
        detailLink={{
          to: '/console/$slug/staff/item/$itemId',
          params: (item: InventoryListItem) => ({ slug, itemId: item.id }),
        }}
      />

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
