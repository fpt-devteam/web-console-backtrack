import type { IConversation } from "@/types/chat.types"

export interface StaffInfo {
  id: string
  name: string
  avatarUrl?: string | null
}

export interface IConversationWithStaff extends IConversation {
  staffInfo?: StaffInfo | null
}

export interface ClaimColumnProps {
  id: string
  title: string
  accent: string
  conversations: IConversationWithStaff[]
  isLoading?: boolean
  isCardDraggable?: (conv: IConversationWithStaff) => boolean
  onOpenConversation?: (conv: IConversationWithStaff) => void
}