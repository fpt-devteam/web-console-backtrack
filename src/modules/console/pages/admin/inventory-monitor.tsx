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
import { useOrgReturnReports } from '@/hooks/use-return-report'

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
  const { data: returnReports } = useOrgReturnReports(currentOrgId, 1, 200)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})

  const items: InventoryListItem[] = data?.items ?? []
  const returnedAtByPostId = useMemo(() => {
    const map: Record<string, string> = {}
    for (const r of returnReports?.items ?? []) {
      const postId = r.post?.id
      if (postId) map[postId] = r.createdAt
    }
    return map
  }, [returnReports?.items])
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-black sm:text-2xl">Inventory</h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-[20px] border-[#dddddd] text-[#6a6a6a] hover:bg-[#f7f7f7] w-full sm:w-auto justify-center sm:justify-start"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="mb-4 min-w-0 w-full overflow-x-auto overflow-y-hidden pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:overflow-visible [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e0e0e0]">
          <InventoryStatusTabs
            className="w-max sm:w-auto"
            value={listState.statusFilter}
            onChange={listState.setStatusFilter}
          />
        </div>

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

        <div className="my-3 flex justify-start sm:justify-end">
          <span className="whitespace-nowrap text-xs text-[#6a6a6a] sm:text-sm">
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
          getDate={(item) => (item.status === 'Returned' ? returnedAtByPostId[item.id] ?? item.createdAt : item.createdAt)}
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
