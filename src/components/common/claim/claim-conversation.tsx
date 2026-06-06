import { Loader2 } from 'lucide-react'
import { MessageList } from '@/components/common/chat/message/message-list'
import { MessageComposer } from '@/components/common/chat/composer/message-composer'
import { TypingIndicator } from '@/components/common/chat/typing/typing-indicator'
import { CLAIM_QUICK_REPLIES } from './claim-quick-replies'
import { getVerificationQuickReplies } from './claim-verification-questions'
import type { IMessage, IConversationPartner } from '@/types/chat.types'

export interface ClaimConversationProps {
  messages: IMessage[]
  currentUserId?: string | null
  partner?: IConversationPartner | null
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isTyping?: boolean
  readOnly?: boolean
  viewOnly?: boolean
  /** Subcategory `code` of the claimed item; picks the verification questions. */
  subcategoryCode?: string | null
  onLoadMore: () => void
  onSend: (text: string) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
}

const GRID_ROWS = { gridTemplateRows: 'minmax(0, 1fr) auto' }

export function ClaimConversation({
  messages,
  currentUserId,
  partner,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  isTyping = false,
  readOnly = false,
  viewOnly = false,
  subcategoryCode,
  onLoadMore,
  onSend,
  onTypingStart,
  onTypingStop,
}: ClaimConversationProps) {
  if (isLoading) {
    return (
      <div className="flex-1 grid min-h-0" style={GRID_ROWS}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff385c]" />
        </div>
        <div />
      </div>
    )
  }

  const composerDisabled = readOnly || viewOnly

  // Base replies plus the "Yêu cầu xác minh" section tailored to this claim's
  // subcategory.
  const quickReplies = [
    ...CLAIM_QUICK_REPLIES,
    ...getVerificationQuickReplies(subcategoryCode),
  ]

  return (
    <div className="flex-1 grid min-h-0" style={GRID_ROWS}>
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
            quickReplies={quickReplies}
          />
        )}
      </div>
    </div>
  )
}
