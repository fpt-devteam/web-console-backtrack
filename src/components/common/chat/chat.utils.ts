import type { IMessage } from '@/types/chat.types'
import type { BubblePosition, MessageGroup } from './chat.types'

export { formatTime } from '@/utils/datetime.util'

export function buildGroups(messages: IMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  for (const msg of messages) {
    const last = groups[groups.length - 1]
    if (last && last.senderId === msg.senderId) {
      last.messages.push(msg)
    } else {
      groups.push({ senderId: msg.senderId, messages: [msg] })
    }
  }
  return groups
}

export function bubbleClass(isOwn: boolean, pos: BubblePosition): string {
  const base = isOwn
    ? 'bg-[#ff385c] text-white'
    : 'bg-[#f7f7f7] text-[#222222]'

  const radius: Record<BubblePosition, string> = isOwn
    ? {
        only:   'rounded-2xl rounded-tr-sm',
        first:  'rounded-2xl rounded-tr-sm',
        middle: 'rounded-2xl rounded-r-sm',
        last:   'rounded-2xl rounded-br-sm',
      }
    : {
        only:   'rounded-2xl rounded-tl-sm',
        first:  'rounded-2xl rounded-tl-sm',
        middle: 'rounded-2xl rounded-l-sm',
        last:   'rounded-2xl rounded-bl-sm',
      }

  return `${base} ${radius[pos]}`
}
