import { Layout } from '../../components/admin/layout'
import { Download } from 'lucide-react'
import { useMemo } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { useParams } from '@tanstack/react-router'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrgMembers } from '@/hooks/use-org'
import type { InventoryListItem } from '@/services/inventory.service'
import { useInventoryListState } from '../../components/inventory/use-inventory-list-state'
import { InventoryListFiltersBar } from '../../components/inventory/inventory-list-filters-bar'
import { InventoryGridCards } from '../../components/inventory/inventory-grid-cards'
import { InventoryStatusTabs } from '../../components/inventory/inventory-status-tabs'
import { useSubcategories } from '@/hooks/use-subcategories'
import { SiteHeader } from '@/components/layout/site-header'

const pageSize = 8

export function AdminInventoryMonitorPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const { currentOrgId } = useCurrentOrgId()
  const { data: membersRes } = useOrgMembers(currentOrgId, 1, 100)
  const members = membersRes?.items ?? []
  
  const listState = useInventoryListState({
    pageSize,
    defaultStatus: 'All',
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
  const authorOptions = useMemo(
    () =>
      members
        .filter((m) => m.role === 'OrgStaff')
        .map((m) => ({
          value: m.userId,
          label: m.displayName || m.email || m.userId,
        })),
    [members],
  )

  return (
    <Layout>
      <SiteHeader
        crumbs={[{ label: 'Inventory' }, { label: 'Dashboard' }]}
        actions={
          <Button variant="outline" size="sm" className="rounded-[20px] border-[#dddddd] text-[#6a6a6a] hover:bg-[#f7f7f7] gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8">
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
          showStatusFilter={false}
          showAuthorFilter
          authorValue={listState.staffId}
          onAuthorChange={listState.setStaffId}
          authorOptions={authorOptions}
          showClear={listState.hasActiveFilters}
          onClear={() => listState.clear({ preserveStatus: true })}
        />

        <div className="flex justify-end my-3">
          <span className="text-sm text-[#6a6a6a] whitespace-nowrap">
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
            to: '/console/$slug/admin/inventory/$itemId',
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
    </Layout>
  )
}
