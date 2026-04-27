import { StaffLayout } from '../../components/staff'
import { Download, Plus, ChevronDown } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useSubcategories } from '@/hooks/use-subcategories'
import type { InventoryListItem } from '@/services/inventory.service'
import { useInventoryListState } from '../../components/inventory/use-inventory-list-state'
import { InventoryListFiltersBar } from '../../components/inventory/inventory-list-filters-bar'
import { InventoryGridCards } from '../../components/inventory/inventory-grid-cards'
import { InventoryStatusTabs } from '../../components/inventory/inventory-status-tabs'
import { useRef, useState, useEffect } from 'react'

const pageSize = 8

export function StaffInventoryPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const [addDropdownOpen, setAddDropdownOpen] = useState(false)
  const addDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!addDropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [addDropdownOpen])

  const listState = useInventoryListState({
    pageSize,
    defaultStatus: 'InStorage',
  })

  const { data, isLoading, isError } = useInventoryItems(currentOrgId, listState.listParams)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})

  const items: InventoryListItem[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const countText =
    !isLoading && totalCount > 0
      ? `${(listState.currentPage - 1) * pageSize + 1}–${Math.min(listState.currentPage * pageSize, totalCount)} of ${totalCount}`
      : null

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#222222]">Inventory</h1>
              {totalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#f0f0f0] text-xs font-semibold text-[#6a6a6a]">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3.5 py-2 border border-[#dddddd] text-[#6a6a6a] rounded-xl bg-white hover:bg-[#f0f0f0] transition-all font-medium text-sm active:scale-[0.97]">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <div className="relative" ref={addDropdownRef}>
                <button
                  onClick={() => setAddDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ff385c] text-white rounded-xl hover:bg-[#e00b41] transition-all font-medium text-sm active:scale-[0.97]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {addDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#dddddd] rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                      onClick={() => {
                        setAddDropdownOpen(false)
                        void navigate({ to: '/console/$slug/staff/inventory-add-item', params: { slug }, search: { type: 'Found' } })
                      }}
                    >
                      Add Found Item
                    </button>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                      onClick={() => {
                        setAddDropdownOpen(false)
                        void navigate({ to: '/console/$slug/staff/inventory-add-item', params: { slug }, search: { type: 'Lost' } })
                      }}
                    >
                      Add Lost Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status tabs */}
          <InventoryStatusTabs
            value={listState.statusFilter}
            onChange={(v) => {
              listState.setStatusFilter(v)
              listState.setCurrentPage(1)
            }}
          />

          {/* Filter chips */}
          <InventoryListFiltersBar
            searchTerm={listState.searchTerm}
            onSearchTermChange={listState.setSearchTerm}
            statusFilter={listState.statusFilter}
            onStatusChange={listState.setStatusFilter}
            categoryFilter={listState.categoryFilter}
            onCategoryChange={listState.setCategoryFilter}
            fromDate={listState.fromDate}
            onFromDateChange={listState.setFromDate}
            toDate={listState.toDate}
            onToDateChange={listState.setToDate}
            layout="oneRow"
            categoryFirst
            showStatusFilter={false}
            showClear={listState.hasActiveFilters}
            onClear={() => listState.clear({ preserveStatus: true })}
            rightSlot={
              countText ? (
                <span className="shrink-0 text-xs text-[#929292] whitespace-nowrap ml-1">{countText}</span>
              ) : null
            }
          />

          {/* Grid */}
          <InventoryGridCards
            items={items}
            isLoading={isLoading}
            isError={isError}
            subcategoryNameById={subcategoryNameById}
            detailLink={{
              to: '/console/$slug/staff/item/$itemId',
              params: (item) => ({ slug, itemId: item.id }),
            }}
          />

          {/* Pagination */}
          {!isLoading && totalCount > pageSize && (
            <Pagination
              currentPage={listState.currentPage}
              totalPages={totalPages}
              onPageChange={listState.setCurrentPage}
            />
          )}

        </div>
      </div>
    </StaffLayout>
  )
}
