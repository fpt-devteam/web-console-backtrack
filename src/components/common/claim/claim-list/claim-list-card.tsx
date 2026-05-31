import { ChevronRight } from 'lucide-react'
import type { IConversation } from '@/types/chat.types'
import { Avatar } from '@/components/common/avatar'
import { ClaimCardImage } from '@/components/common/claim/claim-card/claim-card-image'
import { ClaimCardBadge } from '@/components/common/claim/claim-card/claim-card-badge'
import { formatClaimId } from '@/components/common/claim/claim.utils'
import { formatDateTime } from '@/utils/datetime.util'

interface ClaimListCardProps {
  conv: IConversation
  onView: (conv: IConversation) => void
}

/** A horizontal claim row used inside {@link ClaimList}. */
export function ClaimListCard({ conv, onView }: ClaimListCardProps) {
  const partnerName = conv.partner.displayName ?? conv.partner.email ?? conv.id.slice(0, 8)
  const itemName = conv.supportFormData.itemName
  const imageUrl = conv.supportFormData.imageUrls?.[0] ?? null
  const category = conv.supportFormData.category

  return (
    <button
      type="button"
      onClick={() => onView(conv)}
      className="group w-full text-left bg-white rounded-xl border border-hairline shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex items-center gap-4 p-3"
    >
      <ClaimCardImage src={imageUrl} alt={itemName} category={category} />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-mute">{formatClaimId(conv.id)}</span>
          <ClaimCardBadge status={conv.status} />
        </div>

        <p className="text-md font-semibold text-ink truncate">{itemName}</p>

        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar
            url={conv.partner.avatarUrl}
            name={partnerName}
            className="w-5 h-5 rounded-full text-[9px] shrink-0"
          />
          <span className="text-sm text-mute truncate">{partnerName}</span>
        </div>

        <p className="text-xs text-mute truncate">{conv.lastMessageContent ?? 'No messages yet'}</p>
      </div>

      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        <span className="text-xs text-mute whitespace-nowrap">{formatDateTime(conv.lastMessageAt)}</span>
        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-ink transition-colors" />
      </div>
    </button>
  )
}
