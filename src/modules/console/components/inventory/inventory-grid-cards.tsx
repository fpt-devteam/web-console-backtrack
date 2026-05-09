import { NoResultsEmptyState } from './no-results-empty-state'
import { InventoryCard } from './inventory-card'
import type { InventoryListItem } from '@/services/inventory.service'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#ebebeb] bg-white overflow-hidden">
      <div className="h-40 bg-[#f0f0f0] animate-pulse sm:h-44" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#f0f0f0] rounded-full animate-pulse w-3/4" />
        <div className="h-3 bg-[#f0f0f0] rounded-full animate-pulse w-1/3" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 bg-[#f0f0f0] rounded-full animate-pulse w-2/3" />
          <div className="flex justify-between">
            <div className="h-3 bg-[#f0f0f0] rounded-full animate-pulse w-1/4" />
            <div className="h-3 bg-[#f0f0f0] rounded-full animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function InventoryGridCards({
  items,
  isLoading,
  isError,
  emptyText = 'No items found matching your filters.',
  detailLink,
  subcategoryNameById,
}: {
  items: Array<InventoryListItem>
  isLoading: boolean
  isError: boolean
  emptyText?: string
  detailLink: {
    to: string
    params: (item: InventoryListItem) => Record<string, string>
  }
  subcategoryNameById?: Record<string, string>
}) {
  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-[#929292]">Failed to load inventory items.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return <NoResultsEmptyState title={emptyText} />
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          detailLink={detailLink}
          subcategoryNameById={subcategoryNameById}
        />
      ))}
    </div>
  )
}
