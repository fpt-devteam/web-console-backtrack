import { useMemo, useState } from 'react'
import { ClaimBoard } from '@/components/common/claim/claim-board/claim-board'
import { ClaimBoardHeader } from '@/components/common/claim/claim-board-header/claim-board-header'
import { ClaimBoardFilter } from '@/components/common/claim/claim-board-filter/claim-board-filter'
import { ClaimPreviewDialog } from '@/components/common/claim/claim-dialog/claim-preview-dialog/claim-preview-dialog'
import { filterConversations } from '@/components/common/claim/claim-board/claim-board.helper'
import { applyBoardFilter } from '@/components/common/claim/claim-board-filter/claim-board-filter.helper'
import { DEFAULT_FILTER } from '@/components/common/claim/claim-board-filter/claim-board-filter.types'
import type { ClaimBoardFilterState } from '@/components/common/claim/claim-board-filter/claim-board-filter.types'
import { ConversationStatus } from '@/types/chat.types'
import type { IConversation } from '@/types/chat.types'
import { useConversationUpdates, useSocketChatQueue } from '@/hooks/use-chat-socket'
import {
  useAssignConversation,
  useChatAssigned,
  useChatResolved,
  useChatVerified,
  useResolveConversation,
  useVerifyConversation,
} from '@/hooks/use-chat'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useCurrentUser } from '@/hooks/use-auth'

export function AdminClaimsPage() {
  useConversationUpdates()
  const [searchTerm, setSearchTerm] = useState('')
  const [boardFilter, setBoardFilter] = useState<ClaimBoardFilterState>(DEFAULT_FILTER)
  const [previewConv, setPreviewConv] = useState<IConversation | null>(null)
  const isMe = boardFilter.assignee === 'mine'

  const { currentOrgId } = useCurrentOrgId()
  const { data: currentUser } = useCurrentUser()
  const { data: queueData, isLoading: isQueueLoading, removeFromQueue } = useSocketChatQueue(currentOrgId ?? undefined)
  const assignedQuery  = useChatAssigned({ isMe })
  const verifiedQuery  = useChatVerified({ isMe })
  const resolvedQuery  = useChatResolved({ isMe })

  const assignMutation  = useAssignConversation()
  const verifyMutation  = useVerifyConversation()
  const resolveMutation = useResolveConversation()

  const isLoading = isQueueLoading || assignedQuery.isLoading || verifiedQuery.isLoading || resolvedQuery.isLoading

  const rawQueue    = useMemo(() => Array.isArray(queueData) ? queueData : [],                     [queueData])
  const rawAssigned = useMemo(() => Array.isArray(assignedQuery.data) ? assignedQuery.data : [],   [assignedQuery.data])
  const rawVerified = useMemo(() => Array.isArray(verifiedQuery.data) ? verifiedQuery.data : [],   [verifiedQuery.data])
  const rawResolved = useMemo(() => Array.isArray(resolvedQuery.data) ? resolvedQuery.data : [],   [resolvedQuery.data])

  const queueConversations    = useMemo(() => applyBoardFilter(filterConversations(rawQueue,    searchTerm), boardFilter, currentUser?.id), [rawQueue,    searchTerm, boardFilter, currentUser?.id])
  const assignedConversations = useMemo(() => applyBoardFilter(filterConversations(rawAssigned, searchTerm), boardFilter, currentUser?.id), [rawAssigned, searchTerm, boardFilter, currentUser?.id])
  const verifiedConversations = useMemo(() => applyBoardFilter(filterConversations(rawVerified, searchTerm), boardFilter, currentUser?.id), [rawVerified, searchTerm, boardFilter, currentUser?.id])
  const resolvedConversations = useMemo(() => applyBoardFilter(filterConversations(rawResolved, searchTerm), boardFilter, currentUser?.id), [rawResolved, searchTerm, boardFilter, currentUser?.id])

  // "Assigned" may still include verified claims; keep only in-review ones in that column.
  const inReviewConversations = useMemo(() => assignedConversations.filter((c) => c.status === ConversationStatus.IN_PROGRESS), [assignedConversations])

  const totalCount    = rawQueue.length + rawAssigned.length + rawVerified.length + rawResolved.length
  const filteredCount = queueConversations.length + inReviewConversations.length + verifiedConversations.length + resolvedConversations.length

  return (
    <div className="h-full flex flex-col overflow-hidden">
        {previewConv && (
          <ClaimPreviewDialog
            conv={previewConv}
            onClose={() => setPreviewConv(null)}
          />
        )}
        <ClaimBoardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} className="border-b border-gray-200" />

        <ClaimBoardFilter
          filter={boardFilter}
          totalCount={totalCount}
          filteredCount={filteredCount}
          onChange={setBoardFilter}
        />

        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 pb-6 pt-4">
          <ClaimBoard
            queueConversations={queueConversations}
            assignedConversations={inReviewConversations}
            verifiedConversations={verifiedConversations}
            resolvedConversations={resolvedConversations}
            isLoading={isLoading}
            currentUserId={currentUser?.id}
            isAssignPending={assignMutation.isPending}
            isVerifyPending={verifyMutation.isPending}
            isResolvePending={resolveMutation.isPending}
            onAssign={async (convId: string) => { await assignMutation.mutateAsync(convId) }}
            onVerify={async (convId: string) => { await verifyMutation.mutateAsync({ conversationId: convId }) }}
            onResolve={async (convId: string) => { await resolveMutation.mutateAsync(convId) }}
            onRemoveFromQueue={removeFromQueue}
            onOpenConversation={setPreviewConv}
          />
        </div>
      </div>
  )
}
