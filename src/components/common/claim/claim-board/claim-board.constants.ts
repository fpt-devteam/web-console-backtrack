import { ConversationStatus } from '@/types/chat.types'

export const COLUMNS: { id: ConversationStatus; title: string; accent: string }[] = [
  { id: ConversationStatus.QUEUE,       title: 'Queue',     accent: 'bg-amber-400' },
  { id: ConversationStatus.IN_PROGRESS, title: 'In Review', accent: 'bg-green-500' },
  { id: ConversationStatus.VERIFIED,    title: 'Verified',  accent: 'bg-blue-500' },
  { id: ConversationStatus.CLOSED,      title: 'Resolved',  accent: 'bg-neutral-400' },
]

export const VALID_TRANSITIONS: Partial<Record<ConversationStatus, ConversationStatus[]>> = {
  [ConversationStatus.QUEUE]:       [ConversationStatus.IN_PROGRESS],
  [ConversationStatus.IN_PROGRESS]: [ConversationStatus.VERIFIED],
  [ConversationStatus.VERIFIED]:    [ConversationStatus.CLOSED],
}
