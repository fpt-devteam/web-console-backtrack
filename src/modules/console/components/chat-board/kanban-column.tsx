import { useDroppable } from '@dnd-kit/core'
import { Skeleton } from '@/components/ui/skeleton'
import { ConversationCard } from './conversation-card'
import type { KanbanColumnProps } from './kanban-board.type'

export function KanbanColumn({
  id,
  title,
  accent,
  conversations,
  isLoading = false,
  isCardDraggable,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-96 w-96 shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${accent}`} />
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className="ml-auto text-xs font-medium text-mute bg-neutral-100 rounded-full px-2 py-0.5">
          {conversations.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 rounded-xl p-2 flex flex-col gap-2 min-h-30',
          'transition-colors',
          isOver
            ? 'bg-primary/5 ring-2 ring-primary/30 ring-dashed'
            : 'bg-neutral-100/70',
        ].join(' ')}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-mute text-center py-4">No conversations</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conv={conv}
              disabled={!(isCardDraggable?.(conv) ?? false)}
            />
          ))
        )}
      </div>
    </div>
  )
}
