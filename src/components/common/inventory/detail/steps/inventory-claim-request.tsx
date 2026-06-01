import { ClaimListPanel } from '@/components/common/claim/claim-list/claim-list-panel'
import type { InventoryItem } from '@/services/inventory.service'
import { useChatConversationsByPostId } from '@/hooks/use-chat'
import { SectionTitle, DetailRow } from '../inventory-detail-primitives'
import { formatDateTimeOrDash, formatOrDash } from '../inventory-detail-format'
import { InventoryImageGallery } from '../inventory-image-gallery'
import { InventoryDetailAttributeGrid } from '../inventory-detail-attribute-grid'

export function InventoryClaimRequest({
  item,
  images,
  imgAlt,
  mainImageIndex,
  onMainImageIndexChange,
  subcategoryNameById,
}: {
  item: InventoryItem
  images: string[]
  imgAlt: string
  mainImageIndex: number
  onMainImageIndexChange: (idx: number) => void
  subcategoryNameById?: Record<string, string>
}) {
  const postQuery = useChatConversationsByPostId(item.id, item.organization?.id ?? undefined)
  const postConvs = postQuery.data ?? []

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left — inventory item information */}
      <div className="space-y-5">
        <SectionTitle title="Item" />
        <InventoryImageGallery
          images={images}
          imgAlt={imgAlt}
          mainImageIndex={mainImageIndex}
          onMainImageIndexChange={onMainImageIndexChange}
        />

        <InventoryDetailAttributeGrid
          item={item}
          subcategoryNameById={subcategoryNameById}
          orgSlug={item.organization?.slug}
        />

        <div className="rounded-xl bg-gray-50 px-4 py-3">
          <DetailRow label="Found time" value={formatDateTimeOrDash(item.eventTime)} />
          <DetailRow label="Storage" value={formatOrDash(item.organizationStorageLocation)} />
          <DetailRow label="Found location" value={formatOrDash(item.organizationFoundLocation)} />
        </div>
      </div>

      {/* Right — claim requests linked to this item (read-only) */}
      <div className="space-y-4">
        <SectionTitle title={`Claim requests (${postConvs.length})`} />
        <ClaimListPanel
          conversations={postConvs}
          isLoading={postQuery.isLoading}
          isError={postQuery.isError}
          emptyText="This item doesn't have any related claim requests."
        />
      </div>
    </div>
  )
}
