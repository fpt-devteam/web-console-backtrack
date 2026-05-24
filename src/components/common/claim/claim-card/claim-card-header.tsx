import type { ConversationStatus } from '@/types/chat.types'
import { ClaimCardBadge } from './claim-card-badge'
import { formatClaimId } from '@/components/common/claim/claim.utils'

interface ClaimCardHeaderProps {
  id: string
  itemName: string
  status: ConversationStatus
}

export function ClaimCardHeader({ id, itemName, status }: ClaimCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 h-14">
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-mono text-mute leading-none mb-0.5">
          {formatClaimId(id)}
        </span>
        <p className="text-md font-semibold text-ink leading-snug line-clamp-2">
          {itemName}
        </p>
      </div>
      <ClaimCardBadge status={status} />
    </div>
  )
}
