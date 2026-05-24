import type { IConversation } from '@/types/chat.types'

export function getPartnerName(conv: IConversation): string {
  return conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
}

export function getCardClassName(isDragging: boolean): string {
  return [
    'relative bg-white rounded-xl border border-hairline shadow-sm select-none group',
    'transition-shadow hover:shadow-md cursor-pointer flex flex-col justify-between',
    isDragging ? 'shadow-xl ring-2 ring-primary/30' : '',
  ].join(' ')
}
