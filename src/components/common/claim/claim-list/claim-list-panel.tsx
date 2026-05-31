import { useMemo, useState } from 'react'
import { ConversationStatus } from '@/types/chat.types'
import type { IConversation } from '@/types/chat.types'
import { ClaimList } from './claim-list'
import { ClaimListTabs, type ClaimStatusCounts, type ClaimStatusFilter } from './claim-list-tabs'
import { ClaimListSort, type ClaimSort } from './claim-list-sort'

interface ClaimListPanelProps {
  conversations: IConversation[]
  isLoading: boolean
  isError?: boolean
  emptyText?: string
  onView: (conv: IConversation) => void
}

/** Claim list with a status filter bar and a newest/oldest sort dropdown. */
export function ClaimListPanel({
  conversations,
  isLoading,
  isError,
  emptyText = 'No claim requests.',
  onView,
}: ClaimListPanelProps) {
  const [status, setStatus] = useState<ClaimStatusFilter>('all')
  const [sort, setSort] = useState<ClaimSort>('newest')

  const counts = useMemo<ClaimStatusCounts>(() => {
    const result: ClaimStatusCounts = {
      all: conversations.length,
      [ConversationStatus.QUEUE]: 0,
      [ConversationStatus.IN_PROGRESS]: 0,
      [ConversationStatus.VERIFIED]: 0,
      [ConversationStatus.CLOSED]: 0,
    }
    for (const conv of conversations) result[conv.status] += 1
    return result
  }, [conversations])

  const visible = useMemo(() => {
    const filtered = status === 'all'
      ? conversations
      : conversations.filter((c) => c.status === status)
    return [...filtered].sort((a, b) => {
      const at = new Date(a.createdAt).getTime()
      const bt = new Date(b.createdAt).getTime()
      return sort === 'newest' ? bt - at : at - bt
    })
  }, [conversations, status, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ClaimListTabs active={status} counts={counts} onChange={setStatus} />
        <ClaimListSort value={sort} onChange={setSort} />
      </div>
      <ClaimList
        conversations={visible}
        isLoading={isLoading}
        isError={isError}
        emptyText={emptyText}
        onView={onView}
      />
    </div>
  )
}
