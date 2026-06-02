import { useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { IConversation } from '@/types/chat.types'
import { useChatAssigned, useChatRejected, useChatResolved, useChatVerified } from '@/hooks/use-chat'
import { useConversationUpdates } from '@/hooks/use-chat-socket'
import { filterConversations } from '@/components/common/claim/claim-board/claim-board.helper'
import { AssignedClaimSearch } from '@/components/console/staff/assigned-claim/assigned-claim-search'
import { ClaimListPanel } from '@/components/common/claim/claim-list/claim-list-panel'

export function StaffAssignedClaimPage() {
  useConversationUpdates()

  const navigate = useNavigate()
  const { slug } = useParams({ strict: false })

  const [searchTerm, setSearchTerm] = useState('')

  // Every claim handled by the current staff member, across all statuses.
  // "Assigned" already includes in-review and verified claims; the dedicated
  // queries fill in the terminal (resolved / rejected) ones.
  const assignedQuery = useChatAssigned({ isMe: true })
  const verifiedQuery = useChatVerified({ isMe: true })
  const resolvedQuery = useChatResolved({ isMe: true })
  const rejectedQuery = useChatRejected({ isMe: true })

  const conversations = useMemo(() => {
    const byId = new Map<string, IConversation>()
    for (const conv of [
      ...(assignedQuery.data ?? []),
      ...(verifiedQuery.data ?? []),
      ...(resolvedQuery.data ?? []),
      ...(rejectedQuery.data ?? []),
    ]) {
      byId.set(conv.id, conv)
    }
    return filterConversations([...byId.values()], searchTerm)
  }, [assignedQuery.data, verifiedQuery.data, resolvedQuery.data, rejectedQuery.data, searchTerm])

  const isLoading =
    assignedQuery.isLoading || verifiedQuery.isLoading || resolvedQuery.isLoading || rejectedQuery.isLoading
  const isError =
    assignedQuery.isError || verifiedQuery.isError || resolvedQuery.isError || rejectedQuery.isError

  function handleView(conv: IConversation) {
    if (!slug) return
    navigate({ to: '/console/$slug/staff/claims/$claimId', params: { slug, claimId: conv.id } })
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">My Claims</h1>
            <p className="text-md text-mute mt-1">
              Every claim assigned to you, across all statuses.
            </p>
          </div>
          <AssignedClaimSearch onChange={setSearchTerm} />
        </div>

        <div className="flex-1 flex flex-col min-h-0 mt-4">
          <ClaimListPanel
            conversations={conversations}
            isLoading={isLoading}
            isError={isError}
            emptyText="You don't have any claims yet."
            onView={handleView}
          />
        </div>
      </div>
    </div>
  )
}
