import { StaffLayout } from '../../components/staff'
import { Download, Plus } from 'lucide-react'
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

const pageSize = 8

export function StaffInventoryPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()

  const listState = useInventoryListState({
    pageSize,
    defaultStatus: 'InStorage',
    defaultPostType: 'Found',
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
              <button
                onClick={() => {
                  void navigate({ to: '/console/$slug/staff/inventory-add-item', params: { slug }, search: { type: 'Found' } })
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ff385c] text-white rounded-xl hover:bg-[#e00b41] transition-all font-medium text-sm active:scale-[0.97]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
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
