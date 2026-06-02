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
  _currentUserId: string | undefined,
): (conv: IConversation) => boolean {
  // Only queued claims are draggable (Queue → In Review = "take it on").
  // In Review / Verified / Closed cards are moved through detail-page actions, not DnD.
  if (colId === ConversationStatus.QUEUE) return () => true
  return () => false
}

export function findConv(
  board: BoardState,
  id: string,
): { conv: IConversation; col: ColKey } | null {
  for (const col of Object.keys(board) as ColKey[]) {
    const conv = board[col]?.find((c) => c.id === id)
    if (conv) return { conv, col }
  }
  return null
}
