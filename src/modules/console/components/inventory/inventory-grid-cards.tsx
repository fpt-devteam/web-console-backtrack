import { Archive, Calendar } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryListItem } from '@/services/inventory.service'
import { inventoryStatusBadgeClass, inventoryStatusLabel } from './status'
import { NoResultsEmptyState } from './no-results-empty-state'
import { getInventoryDescription, getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'

export function InventoryGridCards({
  items,
  isLoading,
  isError,
  emptyText = 'No items found matching your filters.',
  detailLink,
  subcategoryNameById,
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
}) {
  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Failed to load inventory items.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
              {item.imageUrls?.[0] ? (
                <img
                  src={item.imageUrls[0]}
                  alt={imgAlt}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${inventoryStatusBadgeClass(
                  item.status,
                )}`}
              >
                {inventoryStatusLabel(item.status)}
              </span>
            </div>
            <div className="mt-1 h-px w-full bg-gray-200" />
            <div className="p-4 pt-3 flex flex-col flex-1">
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-5 min-h-[40px]">
                {displayTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5 min-h-[40px]">
                {getInventoryDescription(item) ?? ''}
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 flex-shrink-0" />
                  <span>{subName.trim() ? subName : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {new Date(item.eventTime).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <Link to={detailLink.to} params={detailLink.params(item)} className="mt-auto block">
                <button className="w-full py-1.5 border border-gray-300 rounded-lg text-black transition-all font-medium text-sm hover:bg-gray-50 hover:scale-[1.03] hover:drop-shadow-sm">
                  View Details
                </button>
              </Link>
            </div>
          </div>
          )
        })
      )}
    </div>
  )
}

