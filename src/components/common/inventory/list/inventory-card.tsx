import { Clock, MapPin, Package, Warehouse } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { InventoryListItem } from '@/services/inventory.service'
import {
  getInventorySubcategoryName,
  getInventoryTitle,
} from '@/utils/inventory-view'
import { inventoryStatusBadgeClass, inventoryStatusLabel } from '../detail/inventory-status'

type InventoryCardProps = {
  item: InventoryListItem
  detailLink: {
    to: string
    params: (item: InventoryListItem) => Record<string, string>
  }
  subcategoryNameById?: Record<string, string>
}

function formatCardDate(value: string | Date | null | undefined) {
  const dateObj =
    typeof value === 'string' || value instanceof Date ? new Date(value) : null

  if (!dateObj || Number.isNaN(dateObj.getTime())) return '—'

  const datePart = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timePart = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${datePart}, ${timePart}`
}

export function InventoryCard({
  item,
  detailLink,
  subcategoryNameById,
}: InventoryCardProps) {
  const displayTitle = getInventoryTitle(item, subcategoryNameById)
  const subName = getInventorySubcategoryName(item, subcategoryNameById).trim()
  const imgAlt = displayTitle.trim() || subName || 'Inventory item'
  const storageLine = item.organizationStorageLocation?.trim() || '—'
  const foundLine = item.organizationFoundLocation?.trim() || '—'

  return (
    <Link
      to={detailLink.to}
      params={detailLink.params(item)}
      className="group block overflow-hidden rounded-xl border border-[#ebebeb] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
    >
      <article data-testid="inventory-card-layout" className="flex flex-col">
        {/* Image — self-contained 4:3 clip with rounded corners */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f7f7]">
          {/* Badges — top-left */}
          <div
            data-testid="inventory-card-badges"
            className="absolute top-3 left-3 right-3 z-10 flex flex-row items-start justify-between gap-2"
          >
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${inventoryStatusBadgeClass(item.status)}`}
            >
              {inventoryStatusLabel(item.status)}
            </span>

            {subName ? (
              <span className="inline-flex max-w-[10rem] items-center rounded-full border border-[#ebebeb] bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#636363] shadow-sm backdrop-blur-sm">
                <span className="truncate">{subName}</span>
              </span>
            ) : null}
          </div>

          {/* Image with zoom-on-hover */}
          {item.imageUrls[0] ? (
            <img
              src={item.imageUrls[0]}
              alt={imgAlt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#c8c8c8]">
              <Package className="h-10 w-10" strokeWidth={1.5} />
              <span className="text-xs font-medium">No image</span>
            </div>
          )}
        </div>

        {/* Info — outside the clipped image, Airbnb-style */}
        <div className="flex flex-col gap-1.5 px-3 pb-3 pt-2.5">
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-[#222222]">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#717171]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
            <span className="shrink-0 text-[#b0b0b0]">Found at:</span>
            <span className="truncate">{foundLine}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#717171]">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
            <span className="shrink-0 text-[#b0b0b0]">Found time:</span>
            <span className="truncate">{formatCardDate(item.eventTime)}</span>
          </div>

          {item.archivedAt ? (
            <div className="flex items-center gap-1.5 text-xs text-[#717171]">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
              <span className="shrink-0 text-[#b0b0b0]">Archived time:</span>
              <span className="truncate">{formatCardDate(item.archivedAt)}</span>
            </div>
          ) : null}

          {item.status === 'Expired' && item.expiredAt ? (
            <div className="flex items-center gap-1.5 text-xs text-[#717171]">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
              <span className="shrink-0 text-[#b0b0b0]">Expired time:</span>
              <span className="truncate">{formatCardDate(item.expiredAt)}</span>
            </div>
          ) : null}

          {item.returnedAt ? (
            <div className="flex items-center gap-1.5 text-xs text-[#717171]">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
              <span className="shrink-0 text-[#b0b0b0]">Returned time:</span>
              <span className="truncate">{formatCardDate(item.returnedAt)}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-1.5 text-xs text-[#717171]">
            <Warehouse className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" />
            <span className="shrink-0 text-[#b0b0b0]">Storage at:</span>
            <span className="truncate">{storageLine}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
