import { useEffect, useRef } from 'react'
import { MessageGroup } from './message-group'
import { buildGroups } from '../chat.utils'
import type { IMessage, IConversationPartner } from '@/types/chat.types'

interface MessageListProps {
  messages: IMessage[]
  currentUserId?: string | null
  partner?: IConversationPartner | null
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export function MessageList({
  messages,
  currentUserId,
  partner,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll the list's own container (not scrollIntoView, which would also scroll
  // ancestor/window and shift the whole claim layout when a message arrives).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const groups = buildGroups([...messages].reverse())

  return (
    <div ref={containerRef} className="min-h-0 overflow-y-auto py-4 px-4 space-y-1 bg-white">
      {hasNextPage && (
        <div className="text-center py-2">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="text-xs text-[#ff385c] hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-center text-sm text-[#929292] mt-8">No messages yet.</p>
      )}

      {groups.map((group, gi) => (
        <MessageGroup
          key={gi}
          group={group}
          isOwn={group.senderId === currentUserId}
          partner={partner}
        />
      ))}
    </div>
  )
}
