import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ConversationStatus, MessageType } from '@/types/chat.types'
import { useConversation, useResolveConversation, useReturnToQueue, useChatMessages } from '@/hooks/use-chat'
import { useConversationUpdates, useIncomingMessages, useMarkSeen, useSendMessage, useTypingIndicator } from '@/hooks/use-chat-socket'
import { useChatContext } from '@/contexts/chat.context'
import { auth } from '@/lib/firebase'
import { ClaimDetailLayout } from '@/components/common/claim/claim-detail/claim-detail-layout'
import { ClaimDetailHeader } from '@/components/common/claim/claim-detail/claim-detail-header'
import { ClaimDetailSidebar } from '@/components/common/claim/claim-detail/sidebar/claim-detail-sidebar'
import { ClaimMainContent } from '@/components/common/claim/claim-detail/main/claim-main-content'
import { ClaimConversation } from '@/components/common/claim/claim-conversation'
import { ClaimResolveDialog } from '@/components/common/claim/claim-dialog/claim-resolve-dialog'
import { Spinner } from '@/components/common/core/spinner'

export function AdminClaimDetailPage() {
  useConversationUpdates()

  const navigate = useNavigate()
  const { slug, claimId } = useParams({ strict: false })

  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false)

  const { data: conv, isLoading } = useConversation(claimId ?? null)
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

  const resolveMutation = useResolveConversation()
  const returnMutation  = useReturnToQueue()

  const status      = conv?.status ?? ConversationStatus.QUEUE
  const isClosed    = status === ConversationStatus.CLOSED
  const partnerName = conv?.partner.displayName || conv?.partner.email || 'Unknown'
  const messages    = messagesData?.pages.flatMap(p => p.messages) ?? []
  const isTyping    = Object.values(typingUsers).some(t => t.conversationId === claimId)

  function handleBack() {
    if (!slug) return
    navigate({ to: '/console/$slug/admin/claims', params: { slug } })
  }

  function handleResolveConfirm() {
    if (!claimId) return
    resolveMutation.mutate(claimId, {
      onSuccess: () => setResolveConfirmOpen(false),
    })
  }

  async function handleReturn() {
    if (!claimId) return
    await returnMutation.mutateAsync(claimId)
    handleBack()
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
      {resolveConfirmOpen && (
          <ClaimResolveDialog
            partnerName={partnerName}
            avatarUrl={conv.partner.avatarUrl}
            isPending={resolveMutation.isPending}
            onConfirm={handleResolveConfirm}
            onCancel={() => setResolveConfirmOpen(false)}
          />
        )}

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
              lastContactAt={conv.lastMessageAt}
              createdAt={conv.createdAt}
              assigneeName={conv.assignedStaff?.displayName ?? null}
              assigneeAvatarUrl={conv.assignedStaff?.avatarUrl ?? null}
              status={status}
              resolvedAt={isClosed ? conv.updatedAt : null}
              isResolvePending={resolveMutation.isPending}
              onResolve={!isClosed ? () => setResolveConfirmOpen(true) : undefined}
              onReturnToQueue={!isClosed ? handleReturn : undefined}
            />
          }
          main={
            <ClaimMainContent supportFormData={conv.supportFormData} />
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
