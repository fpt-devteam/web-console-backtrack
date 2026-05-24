import type { ItemCategory } from '@/services/inventory.service'
import { formatDateTime } from '@/utils/datetime.util'
import { CATEGORY_COLOR } from './claim-card.constants'

interface ClaimCardMetaProps {
  category?: string | null
  lastMessageAt?: string | null
}

export function ClaimCardMeta({ category, lastMessageAt }: ClaimCardMetaProps) {
  const key = (category ?? 'Others') as ItemCategory
  const { bg, text } = CATEGORY_COLOR[key] ?? CATEGORY_COLOR.Others

  return (
    <div className="flex items-center justify-between gap-2">
      {category ? (
        <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${bg} ${text}`}>
          {category}
        </span>
      ) : (
        <span />
      )}
      <span className="text-xs text-mute shrink-0">{formatDateTime(lastMessageAt)}</span>
    </div>
  )
}
