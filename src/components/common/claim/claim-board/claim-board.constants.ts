import { ConversationStatus } from '@/types/chat.types'

export const COLUMNS: { id: ConversationStatus; title: string; accent: string }[] = [
  { id: ConversationStatus.QUEUE,       title: 'Queue',       accent: 'bg-amber-400' },
  { id: ConversationStatus.IN_PROGRESS, title: 'In Progress', accent: 'bg-green-500' },
  { id: ConversationStatus.CLOSED,      title: 'Resolved',    accent: 'bg-neutral-400' },
]

export const VALID_TRANSITIONS: Partial<Record<ConversationStatus, ConversationStatus[]>> = {
  [ConversationStatus.QUEUE]:       [ConversationStatus.IN_PROGRESS],
  [ConversationStatus.IN_PROGRESS]: [ConversationStatus.QUEUE, ConversationStatus.CLOSED],
}
