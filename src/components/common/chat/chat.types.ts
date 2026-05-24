import type { IMessage } from '@/types/chat.types'

export type { IMessage, IConversationPartner, MessageType } from '@/types/chat.types'

export type BubblePosition = 'only' | 'first' | 'middle' | 'last'

export interface MessageGroup {
  senderId: string
  messages: IMessage[]
}

export interface ConversationPartnerInfo {
  avatarUrl?: string | null
  displayName?: string | null
  email?: string | null
}
