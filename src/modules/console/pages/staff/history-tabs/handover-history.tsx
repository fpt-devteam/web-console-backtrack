import { useState, useMemo, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrgReturnReports } from '@/hooks/use-return-report'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import type { OrgReturnReportResult } from '@/services/return-report.service'
import { useSubcategories } from '@/hooks/use-subcategories'
import { getInventoryDescription, getInventoryTitle, getInventoryDistinctiveMarks } from '@/utils/inventory-view'
import type { InventoryListItem } from '@/services/inventory.service'
import { InventoryGridCards } from '@/modules/console/components/inventory/inventory-grid-cards'

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

function matchesSearch(report: OrgReturnReportResult, q: string): boolean {
  if (!q) return true
  const post = report.post
  if (!post) return false
  const hay = [
    getInventoryTitle(post),
    getInventoryDescription(post),
    post.category,
    getInventoryDistinctiveMarks(post),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q.toLowerCase())
}

export function HandoverHistory() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
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

  const { data, isLoading, isError } = useOrgReturnReports(currentOrgId, 1, FETCH_PAGE_SIZE)

  const filteredReports = useMemo(() => {
    const items = data?.items ?? []
    return items.filter((r) => {
      if (!r.post) return false
      if (!matchesDateRange(r.createdAt, fromDate, toDate)) return false
      if (!matchesSearch(r, debouncedSearch)) return false
      return true
    })
  }, [data?.items, fromDate, toDate, debouncedSearch])

  const totalCount = filteredReports.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredReports.slice(start, start + pageSize)
  }, [filteredReports, currentPage])

  const handoverDateByPostId = useMemo(() => {
    const map: Record<string, string> = {}
    for (const r of filteredReports) {
      if (r.post?.id) map[r.post.id] = r.createdAt
    }
    return map
  }, [filteredReports])

  const items: InventoryListItem[] = useMemo(() => {
    return pageItems.map((r) => r.post!).filter(Boolean) as unknown as InventoryListItem[]
  }, [pageItems])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, fromDate, toDate])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="space-y-6">
      <div className="text-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by item name or details..."
            className="w-full pl-9 border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
          />
        </div>

          <div className="w-full md:w-1/2 flex items-center gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || undefined}
            className="w-full border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
          />
          <span className="text-[#929292]">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            className="w-full border-[#dddddd] focus-visible:ring-0 focus-visible:border-[#222222] text-[#222222]"
          />
        </div>

        {(searchTerm || fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
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

      {isError && (
        <div className="text-center py-12">
          <p className="text-[#929292] text-lg">Failed to load return history.</p>
        </div>
      )}

      <InventoryGridCards
        items={items}
        isLoading={isLoading}
        isError={isError}
        emptyText="No matching returns found"
        subcategoryNameById={subcategoryNameById}
        getDate={(item) => handoverDateByPostId[item.id]}
        detailLink={{
          to: '/console/$slug/staff/item/$itemId',
          params: (item) => ({ slug, itemId: item.id }),
        }}
      />

      {!isLoading && totalCount > pageSize && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {!isLoading && (data?.items?.length ?? 0) >= FETCH_PAGE_SIZE && (
        <p className="text-xs text-amber-700 text-center">
          Showing up to {FETCH_PAGE_SIZE} most recent handovers. Narrow filters or ask for server-side paging if you need more.
        </p>
      )}
    </div>
  )
}
