import { useState, useMemo, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrgReturnReports } from '@/hooks/use-return-report'
import { useUser } from '@/hooks/use-user'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { Search, X } from 'lucide-react'
import { Pagination } from '@/components/common/core/pagination'
import { useSubcategories } from '@/hooks/use-subcategories'
import { getInventoryDescription, getInventoryTitle, getInventoryDistinctiveMarks } from '@/utils/inventory-view'
import type { InventoryListItem } from '@/services/inventory.service'
import { useInventoryItems } from '@/hooks/use-inventory'
import { InventoryGridCards } from '@/components/common/inventory/inventory-grid-cards'
import { FilterDateRangeChip } from '@/components/common/inventory/filter-dropdown-chip'

const pageSize = 8
/** Staff return history: BE caps page size; load one batch then filter client-side. */
const FETCH_PAGE_SIZE = 200

function reportCreatedDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function matchesDateRange(createdAt: string, fromDate: string, toDate: string): boolean {
  const key = reportCreatedDateKey(createdAt)
  if (fromDate && key < fromDate) return false
  if (toDate && key > toDate) return false
  return true
}

function matchesItemSearch(item: InventoryListItem, q: string, subcategoryNameById: Record<string, string>): boolean {
  if (!q) return true
  const hay = [
    getInventoryTitle(item, subcategoryNameById),
    getInventoryDescription(item),
    item.category,
    getInventoryDistinctiveMarks(item),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q.toLowerCase())
}

export function HandoverHistory() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const { data: user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})

  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 500)

  const { data: returnReports, isLoading: isReportsLoading, isError: isReportsError } = useOrgReturnReports(
    currentOrgId,
    1,
    FETCH_PAGE_SIZE,
  )

  // Inventory "Returned" items are fetched like the normal grid (same card data source),
  // then constrained using return reports to ensure the return was done by the current staff.
  const { data: inventoryReturned, isLoading: isInventoryLoading, isError: isInventoryError } = useInventoryItems(
    currentOrgId,
    { page: 1, pageSize: FETCH_PAGE_SIZE, status: 'Returned' },
  )

  const reportByPostId = useMemo(() => {
    const map: Record<string, { createdAt: string; staffId?: string | null }> = {}
    for (const r of returnReports?.items ?? []) {
      const postId = r.post?.id
      if (!postId) continue
      map[postId] = { createdAt: r.createdAt, staffId: r.staff?.id ?? null }
    }
    return map
  }, [returnReports?.items])

  const filteredItems = useMemo(() => {
    const staffId = user?.id
    if (!staffId) return []

    const base = (inventoryReturned?.items ?? []) as InventoryListItem[]
    return base.filter((item) => {
      const rep = reportByPostId[item.id]
      if (!rep) return false
      if (rep.staffId !== staffId) return false
      if (!matchesDateRange(rep.createdAt, fromDate, toDate)) return false
      if (!matchesItemSearch(item, debouncedSearch, subcategoryNameById)) return false
      return true
    })
  }, [inventoryReturned?.items, reportByPostId, user?.id, fromDate, toDate, debouncedSearch, subcategoryNameById])

  const totalCount = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const pageItems: InventoryListItem[] = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, fromDate, toDate])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <div className="flex items-center gap-2 flex-nowrap text-sm">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by item name or details..."
            className="w-full h-10 bg-white pl-10 pr-4 border border-[#dddddd] rounded-full focus:outline-none focus:border-[#222222] text-[#222222] placeholder:text-[#b0b0b0] transition-colors hover:border-[#b0b0b0]"
          />
        </div>

        <FilterDateRangeChip
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />

        {(searchTerm || fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
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

      {(isReportsError || isInventoryError) && (
        <div className="text-center py-12">
          <p className="text-[#929292] text-lg">Failed to load return history.</p>
        </div>
      )}

      <InventoryGridCards
        items={pageItems}
        isLoading={isReportsLoading || isInventoryLoading}
        isError={isReportsError || isInventoryError}
        emptyText="No matching returns found"
        subcategoryNameById={subcategoryNameById}

        detailLink={{
          to: '/console/$slug/staff/item/$itemId',
          params: (item) => ({ slug, itemId: item.id }),
        }}
      />

      <div className="mt-auto pt-2">
        {!isReportsLoading && !isInventoryLoading && totalCount > pageSize && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>

      {!isReportsLoading && (returnReports?.items?.length ?? 0) >= FETCH_PAGE_SIZE && (
        <p className="text-xs text-amber-700 text-center">
          Showing up to {FETCH_PAGE_SIZE} most recent handovers. Narrow filters or ask for server-side paging if you need more.
        </p>
      )}
    </div>
  )
}
