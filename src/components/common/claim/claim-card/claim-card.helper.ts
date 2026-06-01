import type { IConversation } from '@/types/chat.types'

export function getPartnerName(conv: IConversation): string {
  return conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
}

export function getCardClassName(isDragging: boolean, interactive = true): string {
  return [
    'relative bg-white rounded-xl border border-hairline shadow-sm select-none group',
    'transition-shadow flex flex-col justify-between',
    interactive ? 'hover:shadow-md cursor-pointer' : 'cursor-default',
    isDragging ? 'shadow-xl ring-2 ring-primary/30' : '',
  ].join(' ')
}
