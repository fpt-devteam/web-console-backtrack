import { useState, useMemo, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useUser } from '@/hooks/use-user'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { Pagination } from '@/components/ui/pagination'
import type { InventoryListItem, PostStatus } from '@/services/inventory.service'
import { InventoryGridCards } from '@/modules/console/components/inventory/inventory-grid-cards'
import { Search, X } from 'lucide-react'
import { useSubcategories } from '@/hooks/use-subcategories'
import { FilterDateRangeChip, FilterDropdownChip } from '@/modules/console/components/inventory/filter-dropdown-chip'
import type { ChipOption } from '@/modules/console/components/inventory/filter-dropdown-chip'

const ALL_STATUS = 'All' as const
type StatusFilter = typeof ALL_STATUS | PostStatus
const STATUS_OPTIONS: Array<ChipOption> = [
  { value: 'All', label: 'All statuses' },
  { value: 'InStorage', label: 'In Storage' },
  { value: 'Returned', label: 'Returned' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Expired', label: 'Expired' },
]
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
      <div className="flex items-center gap-2 flex-nowrap text-sm">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search intake items..."
            className="w-full h-10 bg-white pl-10 pr-4 border border-[#dddddd] rounded-full focus:outline-none focus:border-[#222222] text-[#222222] placeholder:text-[#b0b0b0] transition-colors hover:border-[#b0b0b0]"
          />
        </div>

        <FilterDateRangeChip
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />

        <FilterDropdownChip
          label="Status"
          value={statusFilter}
          defaultValue="All"
          options={STATUS_OPTIONS}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
        />

        {(searchTerm || statusFilter !== ALL_STATUS || fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter(ALL_STATUS)
              setFromDate('')
              setToDate('')
            }}
            className="shrink-0 flex items-center gap-1.5 h-10 px-3.5 rounded-full text-sm text-[#999999] hover:text-[#c13515] hover:bg-[#fff0f0] border border-transparent hover:border-[#fdd] transition-all font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
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
