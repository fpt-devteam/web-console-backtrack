import { StaffLayout } from '../../components/staff'
import { Download, Plus } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import { Link,  useParams } from '@tanstack/react-router'
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
  const { currentOrgId } = useCurrentOrgId()
  const listState = useInventoryListState({
    pageSize,
    defaultStatus: 'All',
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

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto p-4 sm:p-4 lg:p-6 min-h-screen sm:mx-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inventory Dashboard
            </h1>
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

        <InventoryStatusTabs
          value={listState.statusFilter}
          onChange={listState.setStatusFilter}
          className="mb-4"
        />

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
        />

        <div className="flex justify-end my-3">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {items.length > 0
              ? `Showing ${(listState.currentPage - 1) * pageSize + 1}-${Math.min(
                  listState.currentPage * pageSize,
                  totalCount || items.length,
                )} of ${totalCount || items.length} items`
              : 'No items'}
          </span>
        </div>

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

        {!isLoading && totalCount > pageSize && (
          <div className="mt-6">
            <Pagination
              currentPage={listState.currentPage}
              totalPages={totalPages}
              onPageChange={listState.setCurrentPage}
            />
          </div>
        )}
      </div>
    </StaffLayout>
  )
}
