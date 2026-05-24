import type { ConversationStatus } from '@/types/chat.types'
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL } from './claim-card.constants'

interface ClaimCardBadgeProps {
  status: ConversationStatus
}

export function ClaimCardBadge({ status }: ClaimCardBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-full shrink-0 ${STATUS_BADGE[status]}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  )
}
