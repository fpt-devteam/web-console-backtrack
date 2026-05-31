import type { IConversation } from '@/types/chat.types'
import { Skeleton } from '@/components/common/core/skeleton'
import { ClaimListCard } from './claim-list-card'

interface ClaimListProps {
  conversations: IConversation[]
  isLoading: boolean
  isError?: boolean
  emptyText: string
  onView: (conv: IConversation) => void
}

/** A vertical list of claim rows with loading / error / empty states. */
export function ClaimList({
  conversations,
  isLoading,
  isError,
  emptyText,
  onView,
}: ClaimListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <p className="text-mute text-sm">Failed to load claims. Please try again.</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <p className="text-mute text-sm">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {conversations.map((conv) => (
        <ClaimListCard key={conv.id} conv={conv} onView={onView} />
      ))}
    </div>
  )
}
