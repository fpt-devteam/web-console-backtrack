import { Archive, Calendar } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryPost } from '@/services/inventory.service'
import { inventoryStatusBadgeClass, inventoryStatusLabel } from './status'

export function InventoryGridCards({
  items,
  isLoading,
  isError,
  emptyText = 'No items found matching your filters.',
  detailLink,
}: {
  items: InventoryPost[]
  isLoading: boolean
  isError: boolean
  emptyText?: string
  detailLink: {
    to: string
    params: (item: InventoryPost) => Record<string, string>
  }
}) {
  const formatPosted = useMemo(() => {
    return (iso: string) => {
      try {
        const d = new Date(iso)
        return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
      } catch {
        return iso
      }
    }
  }, [])

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
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">{emptyText}</p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
              {item.imageUrls?.[0] ? (
                <img src={item.imageUrls[0]} alt={item.item.itemName} className="w-full h-full object-cover" />
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
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">{item.item.itemName}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5 min-h-[40px]">
                {(() => {
                  const d = item.item.additionalDetails?.trim()
                  if (!d || d === '—' || d === '-') return ''
                  return d
                })()}
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 flex-shrink-0" />
                  <span>{item.item.category || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {item.eventTime
                      ? new Date(item.eventTime).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : formatPosted(item.createdAt)}
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
        ))
      )}
    </div>
  )
}

