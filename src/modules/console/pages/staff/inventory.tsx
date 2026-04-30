import { StaffLayout } from '../../components/staff'
import { Pagination } from '@/components/ui/pagination'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useSubcategories } from '@/hooks/use-subcategories'
import type { InventoryListItem } from '@/services/inventory.service'
import { useInventoryListState } from '../../components/inventory/use-inventory-list-state'
import { InventoryListFiltersBar } from '../../components/inventory/inventory-list-filters-bar'
import { InventoryGridCards } from '../../components/inventory/inventory-grid-cards'
import { InventoryStatusTabs } from '../../components/inventory/inventory-status-tabs'
import { useParams } from '@tanstack/react-router'
import { InventoryCtaButton } from '../../components/inventory/inventory-cta-button'

const pageSize = 8

export function StaffInventoryPage() {
  const { slug } = useParams({ strict: false })
  if (!slug) return;
  const { currentOrgId } = useCurrentOrgId()
  const addItemUrl = `/console/${slug}/staff/inventory-add-item`

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
      <div className="h-full overflow-y-auto flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-4">

          {/* Header */}
          <h1 className="text-2xl font-bold text-black">Inventory</h1>

          <div className='flex justify-between'>
            {/* Status tabs */}
            <InventoryStatusTabs
              value={listState.statusFilter}
              onChange={(v) => {
                listState.setStatusFilter(v)
                listState.setCurrentPage(1)
              }}
            />

            {/* CTA */}
            <InventoryCtaButton addItemUrl={addItemUrl} />
          </div>

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
          <div className="mt-auto pt-2">
            {!isLoading && totalCount > pageSize && (
              <Pagination
                currentPage={listState.currentPage}
                totalPages={totalPages}
                onPageChange={listState.setCurrentPage}
              />
            )}
          </div>

        </div>
      </div>
    </StaffLayout>
  )
}
