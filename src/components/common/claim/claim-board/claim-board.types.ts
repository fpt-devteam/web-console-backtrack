import type { IConversation, ConversationStatus } from "@/types/chat.types"

export interface StaffInfo {
  id: string
  name: string
  avatarUrl?: string | null
}

export type ColKey = ConversationStatus

export interface BoardState {
  [ConversationStatus.QUEUE]:       IConversation[]
  [ConversationStatus.IN_PROGRESS]: IConversation[]
  [ConversationStatus.CLOSED]:      IConversation[]
}

export interface ClaimColumnProps {
  id: string
  title: string
  accent: string
  conversations: IConversation[]
  isLoading?: boolean
  isDropDisabled?: boolean
  isCardDraggable?: (conv: IConversation) => boolean
  onOpenConversation?: (conv: IConversation) => void
}