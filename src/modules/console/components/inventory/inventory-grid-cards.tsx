import { Calendar, MapPin, Package } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { inventoryStatusBadgeClass, inventoryStatusLabel } from './status'
import { NoResultsEmptyState } from './no-results-empty-state'
import type { InventoryListItem } from '@/services/inventory.service'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#ebebeb] bg-white overflow-hidden">
      <div className="h-44 bg-[#f0f0f0] animate-pulse" />
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
  getDate,
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
  getDate?: (item: InventoryListItem) => string | Date | null | undefined
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (items.length === 0) {
    return <NoResultsEmptyState title={emptyText} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => {
        const displayTitle = getInventoryTitle(item, subcategoryNameById)
        const subName = getInventorySubcategoryName(item, subcategoryNameById)
        const imgAlt = displayTitle.trim() || subName.trim() || 'Inventory item'
        const dateValue = getDate ? getDate(item) : item.eventTime
        const dateObj =
          typeof dateValue === 'string' || dateValue instanceof Date
            ? new Date(dateValue)
            : null
        const dateText =
          dateObj && !Number.isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            : '—'
        const foundLocation = item.internalLocation?.trim() || '—'

        return (
          <Link
            key={item.id}
            to={detailLink.to}
            params={detailLink.params(item)}
            className="group block rounded-2xl border border-[#ebebeb] bg-white overflow-hidden hover:border-[#b0b0b0] hover:shadow-md transition-all duration-150"
          >
            {/* Image */}
            <div className="relative h-44 bg-[#f7f7f7] shrink-0">
              {item.imageUrls[0] ? (
                <img
                  src={item.imageUrls[0]}
                  alt={imgAlt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#c8c8c8]">
                  <Package className="w-10 h-10" strokeWidth={1.5} />
                  <span className="text-xs font-medium">No image</span>
                </div>
              )}
              {/* Post type badge */}
              <span
                className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  item.postType === 'Lost'
                    ? 'bg-[#fff3e0] text-[#e65100]'
                    : 'bg-[#e8f5e9] text-[#2e7d32]'
                }`}
              >
                {item.postType === 'Lost' ? 'Lost' : 'Found'}
              </span>
            </div>

            {/* Body */}
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-[#222222] line-clamp-2 leading-snug text-sm group-hover:text-[#ff385c] transition-colors">
                {displayTitle}
              </h3>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${inventoryStatusBadgeClass(item.status)}`}
              >
                {inventoryStatusLabel(item.status)}
              </span>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#6a6a6a]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#b0b0b0]" />
                  <span className="truncate">{foundLocation}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#929292]">
                  {subName.trim() ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#f0f0f0] text-[#6a6a6a] font-medium text-[11px] truncate max-w-[55%]">
                      {subName}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {dateText}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
