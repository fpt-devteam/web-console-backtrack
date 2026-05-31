import type { ConversationStatus } from '@/types/chat.types'
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL } from './claim-card.constants'

interface ClaimCardBadgeProps {
  status: ConversationStatus
}

export function ClaimCardBadge({ status }: ClaimCardBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  )
}
