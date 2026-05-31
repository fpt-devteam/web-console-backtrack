import { ConversationStatus } from '@/types/chat.types'
import type { ItemCategory } from '@/services/inventory.service'

export const STATUS_BADGE: Record<ConversationStatus, string> = {
  [ConversationStatus.QUEUE]:       'bg-amber-50 text-amber-600 border border-amber-200',
  [ConversationStatus.IN_PROGRESS]: 'bg-green-50 text-green-700 border border-green-200',
  [ConversationStatus.VERIFIED]:    'bg-blue-50 text-blue-700 border border-blue-200',
  [ConversationStatus.CLOSED]:      'bg-neutral-100 text-neutral-500 border border-neutral-200',
}

export const STATUS_DOT: Record<ConversationStatus, string> = {
  [ConversationStatus.QUEUE]:       'bg-amber-400',
  [ConversationStatus.IN_PROGRESS]: 'bg-green-500',
  [ConversationStatus.VERIFIED]:    'bg-blue-500',
  [ConversationStatus.CLOSED]:      'bg-neutral-400',
}

export const STATUS_LABEL: Record<ConversationStatus, string> = {
  [ConversationStatus.QUEUE]:       'Queue',
  [ConversationStatus.IN_PROGRESS]: 'In Review',
  [ConversationStatus.VERIFIED]:    'Verified',
  [ConversationStatus.CLOSED]:      'Resolved',
}

export const CATEGORY_COLOR: Record<ItemCategory, { bg: string; text: string }> = {
  PersonalBelongings: { bg: 'bg-amber-50',   text: 'text-amber-600' },
  Cards:              { bg: 'bg-blue-50',     text: 'text-blue-600' },
  Electronics:        { bg: 'bg-violet-50',   text: 'text-violet-600' },
  Others:             { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}
