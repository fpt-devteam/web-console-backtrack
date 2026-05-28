import { useState } from 'react'
import { Search, X, Package } from 'lucide-react'
import { useInventoryItems } from '@/hooks/use-inventory'
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce'
import { Skeleton } from '@/components/common/core/skeleton'
import { InventoryCard } from '@/components/common/inventory/list/inventory-card'
import { getInventoryTitle } from '@/utils/inventory-view'
import type { ItemCategory } from '@/services/inventory.service'

interface ClaimSimilarInventoryProps {
  orgId: string
  slug: string
  category: string
  subCategoryId: string
  subcategoryNameById?: Record<string, string>
  role?: 'staff' | 'admin'
}

export function ClaimSimilarInventory({
  orgId,
  slug,
  category,
  subCategoryId,
  subcategoryNameById,
  role = 'staff',
}: ClaimSimilarInventoryProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data, isLoading } = useInventoryItems(orgId, {
    category: category as ItemCategory,
    status: 'InStorage',
    pageSize: 50,
  })

  const allItems = (data?.items ?? []).filter((item) => item.subcategoryId === subCategoryId)

  const items = debouncedSearch.trim()
    ? allItems.filter((item) =>
        getInventoryTitle(item, subcategoryNameById)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      )
    : allItems

  if (!isLoading && allItems.length === 0) return null

  const detailLink = {
    to: role === 'admin'
      ? '/console/$slug/admin/inventory/$itemId'
      : '/console/$slug/staff/inventory/$itemId',
    params: (item: { id: string }) => ({ slug, itemId: item.id }),
  }

  return (
    <div className="bg-white h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline">
        <Package className="w-3.5 h-3.5 text-mute shrink-0" />
        <span className="text-xs font-bold tracking-widest text-ink uppercase">Similar items in storage</span>
        {!isLoading && (
          <span className="text-[10px] font-medium text-mute bg-gray-100 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1.5 rounded-lg border border-hairline bg-gray-50 px-2.5 py-1.5 w-48">
          <Search className="w-3.5 h-3.5 text-mute shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-mute min-w-0"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-mute hover:text-ink shrink-0">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-xs text-mute text-center py-6">No matching items found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                detailLink={detailLink}
                subcategoryNameById={subcategoryNameById}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
