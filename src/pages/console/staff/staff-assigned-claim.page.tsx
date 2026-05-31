import { useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { IConversation } from '@/types/chat.types'
import { useChatAssigned, useChatResolved } from '@/hooks/use-chat'
import { useConversationUpdates } from '@/hooks/use-chat-socket'
import { filterConversations } from '@/components/common/claim/claim-board/claim-board.helper'
import { AssignedClaimTabs } from '@/components/console/staff/assigned-claim/assigned-claim-tabs'
import { AssignedClaimSearch } from '@/components/console/staff/assigned-claim/assigned-claim-search'
import { ClaimList } from '@/components/common/claim/claim-list/claim-list'
import type { AssignedClaimTab } from '@/components/console/staff/assigned-claim/assigned-claim.types'

export function StaffAssignedClaimPage() {
  useConversationUpdates()

  const navigate = useNavigate()
  const { slug } = useParams({ strict: false })

  const [tab, setTab] = useState<AssignedClaimTab>('handling')
  const [searchTerm, setSearchTerm] = useState('')

  // Only the current staff member's own claims (handling = in progress, resolved = closed).
  const handlingQuery = useChatAssigned({ isMe: true })
  const resolvedQuery = useChatResolved({ isMe: true })

  const rawHandling = useMemo(
    () => (Array.isArray(handlingQuery.data) ? handlingQuery.data : []),
    [handlingQuery.data],
  )
  const rawResolved = useMemo(
    () => (Array.isArray(resolvedQuery.data) ? resolvedQuery.data : []),
    [resolvedQuery.data],
  )

  const handlingConversations = useMemo(
    () => filterConversations(rawHandling, searchTerm),
    [rawHandling, searchTerm],
  )
  const resolvedConversations = useMemo(
    () => filterConversations(rawResolved, searchTerm),
    [rawResolved, searchTerm],
  )

  const activeQuery = tab === 'handling' ? handlingQuery : resolvedQuery
  const activeConversations = tab === 'handling' ? handlingConversations : resolvedConversations

  function handleView(conv: IConversation) {
    if (!slug) return
    navigate({ to: '/console/$slug/staff/claims/$claimId', params: { slug, claimId: conv.id } })
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Claims</h1>
          <p className="text-md text-mute mt-1">
            Claims you're currently handling and the ones you've resolved.
          </p>
        </div>

        <div className="flex flex-col gap-3 my-4 sm:flex-row sm:items-center sm:justify-between">
          <AssignedClaimTabs
            active={tab}
            onChange={setTab}
            handlingCount={handlingConversations.length}
            resolvedCount={resolvedConversations.length}
          />
          <AssignedClaimSearch onChange={setSearchTerm} />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <ClaimList
            conversations={activeConversations}
            isLoading={activeQuery.isLoading}
            isError={activeQuery.isError}
            emptyText={
              tab === 'handling'
                ? 'You have no claims in progress.'
                : "You haven't resolved any claims yet."
            }
            onView={handleView}
          />
        </div>
      </div>
    </div>
  )
}
