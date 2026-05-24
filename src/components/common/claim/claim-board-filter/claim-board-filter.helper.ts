import type { IConversation } from '@/types/chat.types'
import type { AssigneeFilter, ClaimBoardFilterState } from './claim-board-filter.types'

function applyAssigneeFilter(
  conversations: IConversation[],
  assignee: AssigneeFilter,
  currentUserId: string | undefined,
): IConversation[] {
  if (assignee === 'mine') return conversations.filter((c) => c.assignedStaff?.id === currentUserId)
  if (assignee === 'unassigned') return conversations.filter((c) => !c.assignedStaff)
  return conversations
}

function applySort(
  conversations: IConversation[],
  sort: ClaimBoardFilterState['sort'],
): IConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return sort === 'newest' ? bTime - aTime : aTime - bTime
  })
}

export function applyBoardFilter(
  conversations: IConversation[],
  filter: ClaimBoardFilterState,
  currentUserId: string | undefined,
): IConversation[] {
  const filtered = applyAssigneeFilter(conversations, filter.assignee, currentUserId)
  return applySort(filtered, filter.sort)
}
