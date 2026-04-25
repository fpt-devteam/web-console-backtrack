import { Archive, Calendar, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryListItem } from '@/services/inventory.service'
import { inventoryStatusBadgeClass, inventoryStatusLabel } from './status'
import { NoResultsEmptyState } from './no-results-empty-state'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'

export function InventoryGridCards({
  items,
  isLoading,
  isError,
  emptyText = 'No items found matching your filters.',
  detailLink,
  subcategoryNameById,
  getDate,
}: {
  items: InventoryListItem[]
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
      <div className="text-center py-12">
        <p className="text-[#929292] text-lg">Failed to load inventory items.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <div className="col-span-full py-12">
          <Spinner className="mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="col-span-full">
          <NoResultsEmptyState title={emptyText} />
        </div>
      ) : (
        items.map((item) => {
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
              className="group block rounded-[14px] border border-[#dddddd] bg-white overflow-hidden hover:border-[#b0b0b0] hover:shadow-sm transition-all"
            >
              {/* Image */}
              <div className="relative h-44 bg-[#f7f7f7] shrink-0">
                {item.imageUrls?.[0] ? (
                  <img
                    src={item.imageUrls[0]}
                    alt={imgAlt}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#929292] text-sm">
                    No image
                  </div>
                )}
                {/* Status badge */}
                <span
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-semibold ${inventoryStatusBadgeClass(item.status)}`}
                >
                  {inventoryStatusLabel(item.status)}
                </span>
              </div>

              <div className="h-px w-full bg-[#f0f0f0]" />

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <h3 className="font-semibold text-[#222222] line-clamp-2 leading-5 min-h-[40px] text-sm group-hover:text-[#ff385c] transition-colors">
                  {displayTitle}
                </h3>

                <div className="flex items-start gap-1.5 text-sm text-[#6a6a6a]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#929292]" />
                  <span className="line-clamp-1">{foundLocation}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#929292]">
                  <span className="flex items-center gap-1">
                    <Archive className="w-3.5 h-3.5" />
                    {subName.trim() ? subName : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {dateText}
                  </span>
                </div>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
