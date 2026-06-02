import type { IConversation, ConversationStatus } from "@/types/chat.types"

export interface StaffInfo {
  id: string
  name: string
  avatarUrl?: string | null
}

/** The four board columns. Note: the "Closed" column shows both resolved and rejected claims. */
export type ColKey =
  | ConversationStatus.QUEUE
  | ConversationStatus.IN_PROGRESS
  | ConversationStatus.VERIFIED
  | ConversationStatus.CLOSED

export interface BoardState {
  [ConversationStatus.QUEUE]:       IConversation[]
  [ConversationStatus.IN_PROGRESS]: IConversation[]
  [ConversationStatus.VERIFIED]:    IConversation[]
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