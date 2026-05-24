import type { IConversation } from '@/types/chat.types'
import { useDroppable } from '@dnd-kit/core'
import { Skeleton } from '@/components/common/core/skeleton'
import { ClaimCard } from '../claim-card/claim-card'
import type { ClaimColumnProps } from './claim-board.types'

export function ClaimColumn({
  id,
  title,
  accent,
  conversations = [],
  isLoading = false,
  isCardDraggable,
  onOpenConversation,
}: ClaimColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-md w-lg shrink-0 bg-neutral-100/70 rounded-xl px-2 py-4">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <span className={`w-3 h-3 rounded-full shrink-0 ${accent}`} />
        <h3 className="text-md font-semibold text-ink">{title}</h3>
        <span className="text-xs font-medium text-mute bg-white rounded-full px-2 py-0.5">
          {conversations.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 rounded-xl p-2 flex flex-col items-stretch gap-2 min-h-30',
          'transition-colors',
          isOver
            ? 'bg-primary/5 ring-2 ring-primary/30 ring-dashed'
            : 'bg-neutral-100/70',
        ].join(' ')}
      >
        <ColumnContent
          isLoading={isLoading}
          conversations={conversations}
          isCardDraggable={isCardDraggable}
          onOpenConversation={onOpenConversation}
        />
      </div>
    </div>
  )
}
function ColumnContent({ isLoading, conversations, isCardDraggable, onOpenConversation } : {
  isLoading: boolean
  conversations: IConversation[]
  isCardDraggable?: (conv: IConversation) => boolean
  onOpenConversation?: (conv: IConversation) => void
}) {
  if (isLoading) {
    return Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full rounded-xl" />
    ))
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-mute text-center py-4">No claims</p>
      </div>
    )
  }

  return conversations.map((conv) => (
    <ClaimCard
      key={conv.id}
      conv={conv}
      disabled={!(isCardDraggable?.(conv) ?? false)}
      onOpenConversation={onOpenConversation}
    />
  ))
}