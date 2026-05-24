import { Loader2 } from 'lucide-react'
import { MessageList } from '../message/message-list'
import { MessageComposer } from '../composer/message-composer'
import { TypingIndicator } from '../typing/typing-indicator'
import type { IMessage, IConversationPartner } from '@/types/chat.types'

interface ConversationProps {
  messages: IMessage[]
  currentUserId?: string | null
  partner?: IConversationPartner | null
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isTyping?: boolean
  readOnly?: boolean
  viewOnly?: boolean
  /**
   * 'panel' — fills a flex-column parent, e.g. an aside in a multi-column layout
   * 'full'  — standalone, takes full height of its parent container
   */
  variant?: 'panel' | 'full'
  onLoadMore?: () => void
  onSend: (text: string) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
}

const GRID_ROWS = { gridTemplateRows: 'minmax(0, 1fr) auto' }

export function Conversation({
  messages,
  currentUserId,
  partner,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  isTyping = false,
  readOnly = false,
  viewOnly = false,
  variant = 'panel',
  onLoadMore,
  onSend,
  onTypingStart,
  onTypingStop,
}: ConversationProps) {
  const outerClass = variant === 'full'
    ? 'h-full grid min-h-0'
    : 'flex-1 grid min-h-0'

  if (isLoading) {
    return (
      <div className={outerClass} style={GRID_ROWS}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff385c]" />
        </div>
        <div />
      </div>
    )
  }

  const composerDisabled = readOnly || viewOnly

  return (
    <div className={outerClass} style={GRID_ROWS}>
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        partner={partner}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />

      <div>
        {!composerDisabled && <TypingIndicator isActive={isTyping} />}
        {composerDisabled ? (
          <div className="px-4 py-3 border-t border-[#dddddd] text-center text-xs text-[#929292]">
            {readOnly ? 'This conversation has been resolved.' : 'View only.'}
          </div>
        ) : (
          <MessageComposer
            onSend={onSend}
            onTypingStart={onTypingStart}
            onTypingStop={onTypingStop}
          />
        )}
      </div>
    </div>
  )
}
