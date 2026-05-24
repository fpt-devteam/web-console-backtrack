import { X } from 'lucide-react'
import type { ConversationStatus } from '@/types/chat.types'
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL } from '@/components/common/claim/claim.constants'
import { formatClaimId } from '../../claim.utils'

interface ClaimPreviewHeaderProps {
  claimId: string
  status: ConversationStatus
  onClose: () => void
}

export function ClaimPreviewHeader({ claimId, status, onClose }: ClaimPreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-ink">{formatClaimId(claimId)}</span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}>
          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
          {STATUS_LABEL[status]}
        </span>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-neutral-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
