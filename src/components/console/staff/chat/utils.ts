import type { IMessage } from '@/types/chat.types'
import { ConversationStatus, MessageType } from '@/types/chat.types'

export { MessageType }

export const AVATAR_COLORS = [
  '#E67E22', '#E74C3C', '#9B59B6', '#2980B9',
  '#27AE60', '#16A085', '#D35400', '#8E44AD',
  '#2471A3', '#1E8449',
]

export function pickColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export type MsgGroup = { senderId: string; messages: Array<IMessage> }

export function buildGroups(messages: Array<IMessage>): Array<MsgGroup> {
  const groups: Array<MsgGroup> = []
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

export function bubbleClass(isOwn: boolean, pos: 'only' | 'first' | 'middle' | 'last') {
  const base = isOwn ? 'bg-[#222222] text-white' : 'bg-[#f7f7f7] text-[#222222]'
  const radius: Record<string, string> = {
    only:   'rounded-2xl',
    first:  isOwn ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md',
    middle: isOwn ? 'rounded-2xl rounded-r-md'  : 'rounded-2xl rounded-l-md',
    last:   isOwn ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tl-md',
  }
  return `${base} ${radius[pos]}`
}

export function statusBadge(status: ConversationStatus | undefined): string {
  switch (status) {
    case ConversationStatus.QUEUE:       return 'bg-[#fff8e6] text-[#c97a00]'
    case ConversationStatus.IN_PROGRESS: return 'bg-[#e8f9f0] text-[#06c167]'
    case ConversationStatus.CLOSED:      return 'bg-[#f0f0f0] text-[#555555]'
    default:                             return 'bg-[#f7f7f7] text-[#929292]'
  }
}

export function statusLabel(status: ConversationStatus | undefined): string {
  switch (status) {
    case ConversationStatus.QUEUE:       return 'Queue'
    case ConversationStatus.IN_PROGRESS: return 'Active'
    case ConversationStatus.CLOSED:      return 'Closed'
    default: return status ?? ''
  }
}
