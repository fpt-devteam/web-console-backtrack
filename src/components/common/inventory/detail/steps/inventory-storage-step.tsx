import type { InventoryItem } from '@/services/inventory.service'
import { InventoryDetailAttributeGrid, ItemQrCard } from '../inventory-detail-attribute-grid'
import { DetailRow, SectionTitle } from '../inventory-detail-primitives'
import { formatDateTimeOrDash, formatOrDash } from '../inventory-detail-format'
import { InventoryImageGallery } from '../inventory-image-gallery'

export function InventoryStorageStep({
  item,
  images,
  imgAlt,
  mainImageIndex,
  onMainImageIndexChange,
  showAddThumbnailButton = false,
  subcategoryNameById,
}: {
  item: InventoryItem
  images: string[]
  imgAlt: string
  mainImageIndex: number
  onMainImageIndexChange: (idx: number) => void
  showAddThumbnailButton?: boolean
  subcategoryNameById?: Record<string, string>
}) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Item photos" />
      <InventoryImageGallery
        images={images}
        imgAlt={imgAlt}
        mainImageIndex={mainImageIndex}
        onMainImageIndexChange={onMainImageIndexChange}
        showAddThumbnailButton={showAddThumbnailButton}
      />

      <div className='grid gap-4 grid-cols-5'>
        <div className='col-span-3'>
          <SectionTitle title="Item details" />
          <InventoryDetailAttributeGrid
            item={item}
            subcategoryNameById={subcategoryNameById}
            orgSlug={item.organization?.slug}
          />
        </div>

        <div className='col-span-2 space-y-4'>
          <SectionTitle title="Found details & QR" />
          {/* found time, storage & found location */}
          <div className="rounded-xl bg-gray-50 px-4 py-3 mb-12">
            <DetailRow label="Found time" value={formatDateTimeOrDash(item.eventTime)} />
            <DetailRow label="Storage" value={formatOrDash(item.organizationStorageLocation)} />
            <DetailRow label="Found location" value={formatOrDash(item.organizationFoundLocation)} />
          </div>

          {/* QR code */}
          {item.organization?.slug ? (
            <div className="flex items-center justify-center rounded-xl border border-gray-200 p-4">
              <ItemQrCard orgSlug={item.organization.slug} itemId={item.id} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
