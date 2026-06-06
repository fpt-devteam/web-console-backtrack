import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { ConversationStatus, MessageType } from '@/types/chat.types'
import type { InventoryItem, InventoryListItem } from '@/services/inventory.service'
import { useConversation, useRejectConversation, useVerifyConversation, useChatMessages, useMarkInventoryNotMatch } from '@/hooks/use-chat'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useSubcategories } from '@/hooks/use-subcategories'
import { useConversationUpdates, useIncomingMessages, useMarkSeen, useSendMessage, useTypingIndicator } from '@/hooks/use-chat-socket'
import { useChatContext } from '@/contexts/chat.context'
import { auth } from '@/lib/firebase'
import { ClaimDetailLayout } from '@/components/common/claim/claim-detail/claim-detail-layout'
import { ClaimDetailHeader } from '@/components/common/claim/claim-detail/claim-detail-header'
import { ClaimDetailSidebar } from '@/components/common/claim/claim-detail/sidebar/claim-detail-sidebar'
import { ClaimVerifyMain } from '@/components/common/claim/claim-detail/main/claim-verify-main'
import { ClaimConversation } from '@/components/common/claim/claim-conversation'
import { ClaimRejectDialog } from '@/components/common/claim/claim-dialog/claim-reject-dialog'
import { ClaimVerifyDialog } from '@/components/common/claim/claim-dialog/claim-verify-dialog'
import { ClaimNotMatchDialog } from '@/components/common/claim/claim-dialog/claim-not-match-dialog'
import { Spinner } from '@/components/common/core/spinner'

export function StaffClaimDetailPage() {
  useConversationUpdates()

  const navigate = useNavigate()
  const { slug, claimId } = useParams({ strict: false })

  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false)
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false)
  // Item chosen to verify against when the claim isn't linked to a stored item.
  const [selectedItem, setSelectedItem] = useState<InventoryListItem | null>(null)
  // Item pending "not a match" confirmation.
  const [notMatchTarget, setNotMatchTarget] = useState<{ id: string; name: string } | null>(null)

  // ── Conversation data ──────────────────────────────────────
  const { currentOrgId } = useCurrentOrgId()
  const { data: conv, isLoading } = useConversation(claimId ?? null, currentOrgId ?? undefined)
  const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: messagesLoading } =
    useChatMessages(claimId ?? '')
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()
  const { typingUsers, setActiveConversationId } = useChatContext()

  useIncomingMessages(claimId ?? '')

  // Join the conversation's socket room so incoming messages and typing
  // arrive in real time (and leave it on unmount / when switching claims).
  useEffect(() => {
    if (!claimId) return
    setActiveConversationId(claimId)
    return () => setActiveConversationId(null)
  }, [claimId, setActiveConversationId])

  useEffect(() => {
    if (claimId) markSeen(claimId)
  }, [claimId, markSeen])

  // ── Linked inventory item (for claim ↔ found-item comparison) ─
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

  // ── Mutations ──────────────────────────────────────────────
  const rejectMutation = useRejectConversation()
  const verifyMutation  = useVerifyConversation()
  const notMatchMutation = useMarkInventoryNotMatch()

  // ── Derived state ──────────────────────────────────────────
  const status      = conv?.status ?? ConversationStatus.QUEUE
  // Both "resolved" (closed) and "rejected" are terminal — read-only, no actions.
  const isClosed    = status === ConversationStatus.CLOSED || status === ConversationStatus.REJECTED
  const partnerName = conv?.partner?.displayName || conv?.partner?.email || 'Unknown'
  const messages    = messagesData?.pages.flatMap(p => p.messages) ?? []
  const isTyping    = Object.values(typingUsers).some(t => t.conversationId === claimId)

  function handleBack() {
    if (!slug) return
    navigate({ to: '/console/$slug/staff/claims', params: { slug } })
  }

  function handleViewLinkedItem() {
    if (!slug || !inventoryItem) return
    navigate({ to: '/console/$slug/staff/inventory/$itemId', params: { slug, itemId: inventoryItem.id } })
  }

  // Accept → confirm, then mark the claim as verified against the chosen/linked item.
  // The verify mutation invalidates the assigned/verified/conversation caches on success.
  function handleAcceptConfirm(item: InventoryItem) {
    if (!claimId) return
    // Attach the matched item to the claim (sets the conversation's postId).
    verifyMutation.mutate({ conversationId: claimId, postId: item.id }, {
      onSuccess: () => {
        setAcceptConfirmOpen(false)
        toast.success(`Claim verified against "${item.postTitle}".`)
      },
      onError: () => toast.error('Failed to verify claim'),
    })
  }

  // Reject → confirm, then close the claim as rejected.
  // The reject mutation invalidates the assigned/verified/resolved/conversation caches on success.
  function handleRejectConfirm() {
    if (!claimId) return
    rejectMutation.mutate(claimId, {
      onSuccess: () => {
        setRejectConfirmOpen(false)
        toast.success('Claim rejected.')
      },
      onError: () => toast.error('Failed to reject claim'),
    })
  }

  function handleSend(text: string) {
    if (!claimId) return
    send({ conversationId: claimId, type: MessageType.TEXT, content: text })
  }

  // Staff clicks "Not a match" → open a confirm dialog before committing.
  function handleMarkNotMatch(inventoryId: string, itemName: string) {
    setNotMatchTarget({ id: inventoryId, name: itemName })
  }

  // Confirmed in the dialog → drop the item from this claim's suggestions.
  function handleNotMatchConfirm() {
    if (!claimId || !notMatchTarget) return
    const { id } = notMatchTarget
    notMatchMutation.mutate(
      { conversationId: claimId, inventoryId: id },
      {
        onSuccess: () => {
          // If the item being compared was just dismissed, return to the picker.
          setSelectedItem((cur) => (cur?.id === id ? null : cur))
          setNotMatchTarget(null)
        },
        onError: () => toast.error('Failed to mark item as not a match'),
      },
    )
  }

  if (isLoading || !conv) {
    return (
      <div className="h-full flex items-center justify-center text-mute text-sm">
        <Spinner size='lg' />
      </div>
    )
  }

  // The item the claim is verified against: the linked item, or the staff's pick.
  const hasLinkedItem = !!conv.supportFormData.postId
  const comparisonItem: InventoryItem | null = hasLinkedItem ? (inventoryItem ?? null) : selectedItem
  const isVerified = status === ConversationStatus.VERIFIED
  // Reject is allowed while the claim is in review or verified (backend: in_progress | in_verified).
  const canReject = !isClosed && (status === ConversationStatus.IN_PROGRESS || isVerified)
  // Accept (verify) only makes sense before the claim is verified or closed; it needs a matching item.
  const showAccept = !isClosed && !isVerified && status === ConversationStatus.IN_PROGRESS
  const canAccept = showAccept && !!comparisonItem

  return (
    <>
      {acceptConfirmOpen && (
        <ClaimVerifyDialog
          partnerName={partnerName}
          avatarUrl={conv.partner?.avatarUrl}
          isPending={verifyMutation.isPending}
          onConfirm={() => comparisonItem && handleAcceptConfirm(comparisonItem)}
          onCancel={() => setAcceptConfirmOpen(false)}
        />
      )}

      {rejectConfirmOpen && (
        <ClaimRejectDialog
          partnerName={partnerName}
          avatarUrl={conv.partner?.avatarUrl}
          isPending={rejectMutation.isPending}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectConfirmOpen(false)}
        />
      )}

      {notMatchTarget && (
        <ClaimNotMatchDialog
          itemName={notMatchTarget.name}
          isPending={notMatchMutation.isPending}
          onConfirm={handleNotMatchConfirm}
          onCancel={() => setNotMatchTarget(null)}
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

            createdAt={conv.createdAt}
            assigneeName={conv.assignedStaff?.displayName ?? null}
            assigneeAvatarUrl={conv.assignedStaff?.avatarUrl ?? null}
            status={status}
            firstAssignedAt={conv.firstAssignedAt}
            verifiedAt={conv.verifiedAt}
            resolvedAt={conv.resolvedAt}
            rejectedAt={conv.rejectedAt}
            canAccept={canAccept}
            isActionPending={verifyMutation.isPending || rejectMutation.isPending}
            onAccept={showAccept ? () => setAcceptConfirmOpen(true) : undefined}
            onReject={canReject ? () => setRejectConfirmOpen(true) : undefined}
            supportFormData={conv.supportFormData}
          />
        }
        main={
          <ClaimVerifyMain
            supportFormData={conv.supportFormData}
            linkedItem={inventoryItem}
            isLinkedLoading={isInventoryLoading}
            orgId={conv.orgId}
            subcategoryNameById={subcategoryNameById}
            subcategoryCodeById={subcategoryCodeById}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onViewLinkedItem={hasLinkedItem && inventoryItem ? handleViewLinkedItem : undefined}
            onMarkNotMatch={handleMarkNotMatch}
            markingNotMatchId={notMatchMutation.isPending ? notMatchMutation.variables?.inventoryId ?? null : null}
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
