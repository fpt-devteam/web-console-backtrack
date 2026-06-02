import { ConversationStatus } from '@/types/chat.types'
import type { ColKey } from './claim-board.types'

export const COLUMNS: { id: ColKey; title: string; accent: string }[] = [
  { id: ConversationStatus.QUEUE,       title: 'Queue',     accent: 'bg-amber-400' },
  { id: ConversationStatus.IN_PROGRESS, title: 'In Review', accent: 'bg-green-500' },
  { id: ConversationStatus.VERIFIED,    title: 'Verified',  accent: 'bg-blue-500' },
  { id: ConversationStatus.CLOSED,      title: 'Closed',    accent: 'bg-neutral-400' },
]

// Drag-and-drop is limited to "take it on" (Queue → In Review).
// Later transitions (verify, resolve, reject) happen via the claim detail actions.
export const VALID_TRANSITIONS: Partial<Record<ConversationStatus, ConversationStatus[]>> = {
  [ConversationStatus.QUEUE]: [ConversationStatus.IN_PROGRESS],
}
