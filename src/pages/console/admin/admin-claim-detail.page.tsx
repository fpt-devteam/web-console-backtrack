import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ConversationStatus, MessageType } from '@/types/chat.types'
import { useConversation, useChatMessages } from '@/hooks/use-chat'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useSubcategories } from '@/hooks/use-subcategories'
import { useConversationUpdates, useIncomingMessages, useMarkSeen, useSendMessage, useTypingIndicator } from '@/hooks/use-chat-socket'
import { useChatContext } from '@/contexts/chat.context'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { auth } from '@/lib/firebase'
import { ClaimDetailLayout } from '@/components/common/claim/claim-detail/claim-detail-layout'
import { ClaimDetailHeader } from '@/components/common/claim/claim-detail/claim-detail-header'
import { ClaimDetailSidebar } from '@/components/common/claim/claim-detail/sidebar/claim-detail-sidebar'
import { ClaimMainContent } from '@/components/common/claim/claim-detail/main/claim-main-content'
import { ClaimConversation } from '@/components/common/claim/claim-conversation'
import { Spinner } from '@/components/common/core/spinner'

export function AdminClaimDetailPage() {
  useConversationUpdates()

  const navigate = useNavigate()
  const { slug, claimId } = useParams({ strict: false })

  const { currentOrgId } = useCurrentOrgId()
  const { data: conv, isLoading } = useConversation(claimId ?? null, currentOrgId ?? undefined)
  const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: messagesLoading } =
    useChatMessages(claimId ?? '')
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()
  const { typingUsers } = useChatContext()

  useIncomingMessages(claimId ?? '')

  useEffect(() => {
    if (claimId) markSeen(claimId)
  }, [claimId, markSeen])

  const postId = conv?.supportFormData.postId ?? null
  const { data: inventoryItem, isLoading: isInventoryLoading } = useInventoryItem(conv?.orgId ?? null, postId)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of subcategories ?? []) map[s.id] = s.name
    return map
  }, [subcategories])
  const subcategoryCodeById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of subcategories ?? []) map[s.id] = s.code
    return map
  }, [subcategories])

  const status      = conv?.status ?? ConversationStatus.QUEUE
  const isClosed    = status === ConversationStatus.CLOSED
  const messages    = messagesData?.pages.flatMap(p => p.messages) ?? []
  const isTyping    = Object.values(typingUsers).some(t => t.conversationId === claimId)

  function handleBack() {
    if (!slug) return
    navigate({ to: '/console/$slug/admin/claims', params: { slug } })
  }

  function handleSend(text: string) {
    if (!claimId) return
    send({ conversationId: claimId, type: MessageType.TEXT, content: text })
  }

  if (isLoading || !conv) {
    return (
      <div className="h-full flex items-center justify-center text-mute text-sm">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
        <ClaimDetailLayout
          header={
            <ClaimDetailHeader
              claimId={conv.id}
              status={status}
              onBack={handleBack}
            />
          }
          sidebar={
            <ClaimDetailSidebar
              partner={conv.partner}

              createdAt={conv.createdAt}
              assigneeName={conv.assignedStaff?.displayName ?? null}
              assigneeAvatarUrl={conv.assignedStaff?.avatarUrl ?? null}
              status={status}
              firstAssignedAt={conv.firstAssignedAt}
              verifiedAt={conv.verifiedAt}
              resolvedAt={conv.resolvedAt}
              supportFormData={conv.supportFormData}
            />
          }
          main={
            <ClaimMainContent
              supportFormData={conv.supportFormData}
              inventoryItem={inventoryItem}
              isInventoryLoading={isInventoryLoading}
              subcategoryNameById={subcategoryNameById}
              subcategoryCodeById={subcategoryCodeById}
              orgId={conv.orgId}
              slug={slug}
              role="admin"
            />
          }
          messaging={
            <ClaimConversation
              messages={messages}
              currentUserId={auth.currentUser?.uid}
              partner={conv.partner}
              isLoading={messagesLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isTyping={isTyping}
              readOnly={isClosed}
              onLoadMore={() => fetchNextPage()}
              onSend={handleSend}
              onTypingStart={startTyping}
              onTypingStop={stopTyping}
            />
          }
        />
    </>
  )
}
