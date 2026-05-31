import { useEffect } from 'react'
import { ClaimConversation } from '@/components/common/claim/claim-conversation'
import { MessageType } from '@/types/chat.types'
import type { IConversationPartner } from '@/types/chat.types'
import { useChatMessages } from '@/hooks/use-chat'
import { useIncomingMessages, useMarkSeen, useSendMessage, useTypingIndicator } from '@/hooks/use-chat-socket'
import { useChatContext } from '@/contexts/chat.context'
import { auth } from '@/lib/firebase'

export function ConnectedClaimConversation({
  conversationId, partner, readOnly, viewOnly,
}: {
  conversationId: string
  partner?: IConversationPartner | null
  readOnly?: boolean
  viewOnly?: boolean
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(conversationId)
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()
  const { typingUsers } = useChatContext()
  useIncomingMessages(conversationId)
  useEffect(() => { markSeen(conversationId) }, [conversationId, markSeen])
  const isTyping = Object.values(typingUsers).some(t => t.conversationId === conversationId)
  const messages = data?.pages.flatMap(p => p.messages) ?? []
  return (
    <ClaimConversation
      messages={messages}
      currentUserId={auth.currentUser?.uid}
      partner={partner}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isTyping={isTyping}
      readOnly={readOnly}
      viewOnly={viewOnly}
      onLoadMore={() => fetchNextPage()}
      onSend={(text) => send({ conversationId, type: MessageType.TEXT, content: text })}
      onTypingStart={startTyping}
      onTypingStop={stopTyping}
    />
  )
}
