import type { IConversation } from '@/types/chat.types'

export interface ClaimCardProps {
  conv: IConversation
  disabled?: boolean
  onOpenConversation?: (conv: IConversation) => void
}
