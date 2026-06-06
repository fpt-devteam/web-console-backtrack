import { Clock, Package } from 'lucide-react'
import type { ItemCategory } from '@/services/inventory.service'
import { formatDateTime } from '@/utils/datetime.util'
import { CATEGORY_COLOR } from './claim-card.constants'

interface ClaimCardMetaProps {
  category?: string | null
  lastMessageAt?: string | null
  /** In-storage items of the same subcategory this claim could be matched against. */
  matchCount?: number
}

export function ClaimCardMeta({ category, lastMessageAt, matchCount = 0 }: ClaimCardMetaProps) {
  const key = (category ?? 'Others') as ItemCategory
  const { bg, text } = CATEGORY_COLOR[key] ?? CATEGORY_COLOR.Others

  return (
    <div className="flex flex-col gap-1">
      {/* Row 1: category + matching items */}
      <div className="flex items-center gap-1.5 min-w-0">
        {category ? (
          <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${bg} ${text}`}>
            {category}
          </span>
        ) : null}
        {matchCount > 0 && (
          <span
            title={`${matchCount} item${matchCount > 1 ? 's' : ''} in storage match this claim`}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 shrink-0"
          >
            <Package className="h-3 w-3" />
            {matchCount} match{matchCount > 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Row 2: last updated */}
      <span className="flex items-center gap-1 text-xs text-mute" title="Last updated">
        <Clock className="h-3 w-3 shrink-0" />
        {formatDateTime(lastMessageAt)}
      </span>
    </div>
  )
}
