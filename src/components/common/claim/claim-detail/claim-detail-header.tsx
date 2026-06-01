import { ChevronLeft } from 'lucide-react'
import type { ConversationStatus } from '@/types/chat.types'
import { formatClaimId } from '@/components/common/claim/claim.utils'
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL } from '@/components/common/claim/claim.constants'

interface ClaimDetailHeaderProps {
  claimId: string
  status: ConversationStatus
  onBack: () => void
}

export function ClaimDetailHeader({
  claimId,
  status,
  onBack
}: ClaimDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-mute hover:text-ink hover:cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to board
      </button>

      <span className="text-neutral-200">|</span>

      <div className="flex items-center gap-1 text-sm text-mute">
        <span>Claims</span>
        <span>/</span>
        <span className="font-mono font-semibold text-ink mt-1">{formatClaimId(claimId)}</span>
      </div>

      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 text-sm font-semibold rounded-full ${STATUS_BADGE[status]}`}>
        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
        {STATUS_LABEL[status]}
      </span>
    </div>
  )
}
