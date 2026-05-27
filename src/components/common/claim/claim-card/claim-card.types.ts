import type { IConversation } from '@/types/chat.types'

export interface ClaimCardProps {
  conv: IConversation
  disabled?: boolean
  onOpenConversation?: (conv: IConversation) => void
  /** When provided, a "Take on" button is shown on queued cards so a staff member can claim it. */
  onTakeOn?: (conv: IConversation) => void | Promise<void>
}
