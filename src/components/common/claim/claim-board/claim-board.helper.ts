import { ConversationStatus } from '@/types/chat.types'
import type { IConversation } from '@/types/chat.types'
import type { BoardState, ColKey } from './claim-board.types'

export function filterConversations(
  conversations: IConversation[],
  searchTerm: string,
): IConversation[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return conversations
  return conversations.filter((c) => {
    const name = (c.partner?.displayName ?? c.partner?.email ?? '').toLowerCase()
    const itemTitle = (c.supportFormData?.itemName ?? '').toLowerCase()
    return (
      name.includes(term) ||
      itemTitle.includes(term) ||
      c.id.toLowerCase().includes(term) ||
      (c.lastMessageContent ?? '').toLowerCase().includes(term)
    )
  })
}

export function isCardDraggable(
  colId: ConversationStatus,
  currentUserId: string | undefined,
): (conv: IConversation) => boolean {
  if (colId === ConversationStatus.QUEUE) return () => true
  if (colId === ConversationStatus.IN_PROGRESS || colId === ConversationStatus.VERIFIED)
    return (conv) => conv.assignedStaff?.id === currentUserId
  return () => false
}

export function findConv(
  board: BoardState,
  id: string,
): { conv: IConversation; col: ColKey } | null {
  for (const col of Object.values(ConversationStatus)) {
    const conv = board[col].find((c) => c.id === id)
    if (conv) return { conv, col: col as ColKey }
  }
  return null
}
