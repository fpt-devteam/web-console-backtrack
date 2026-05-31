import { useState } from 'react'
import { AdminModal } from '@/components/console/admin/admin-modal'
import { Avatar } from '@/components/common/avatar'
import { ClaimList } from '@/components/common/claim/claim-list/claim-list'
import { ConversationStatus } from '@/types/chat.types'
import type { IConversation } from '@/types/chat.types'
import type { InventoryItem } from '@/services/inventory.service'
import { useChatConversationsByPostId } from '@/hooks/use-chat'
import { ConnectedClaimConversation } from '../connected-claim-conversation'
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
  const [openConv, setOpenConv] = useState<IConversation | null>(null)

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

      {/* Right — claim requests linked to this item */}
      <div className="space-y-4">
        <SectionTitle title={`Claim requests (${postConvs.length})`} />
        <ClaimList
          conversations={postConvs}
          isLoading={postQuery.isLoading}
          isError={postQuery.isError}
          emptyText="This item doesn't have any related claim requests."
          onView={setOpenConv}
        />
      </div>

      <AdminModal
        open={!!openConv}
        title={
          openConv?.partner.displayName ??
          openConv?.partner.email ??
          (openConv ? `Conversation ${openConv.id.slice(0, 8)}` : 'Conversation')
        }
        header={
          openConv ? (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                url={openConv.partner.avatarUrl}
                name={openConv.partner.displayName ?? openConv.partner.email ?? openConv.id.slice(0, 2)}
                className="w-9 h-9 rounded-full shrink-0"
              />
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-semibold text-[#222222] truncate">
                  {openConv.partner.displayName ?? openConv.partner.email ?? openConv.id.slice(0, 8)}
                </p>
                {openConv.partner.email && openConv.partner.displayName ? (
                  <p className="text-xs text-[#929292] truncate">{openConv.partner.email}</p>
                ) : null}
              </div>
            </div>
          ) : null
        }
        onClose={() => setOpenConv(null)}
      >
        {openConv && (
          <div className="h-[70vh] min-h-[520px] flex flex-col rounded-xl border border-[#ebebeb] overflow-hidden">
            <ConnectedClaimConversation
              conversationId={openConv.id}
              partner={openConv.partner}
              readOnly={openConv.status === ConversationStatus.CLOSED}
              viewOnly
            />
          </div>
        )}
      </AdminModal>
    </div>
  )
}
