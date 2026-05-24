import type { IConversation } from '@/types/chat.types'

export interface ClaimPreviewDialogProps {
  conv: IConversation
  onClose: () => void
  onTakeIt?: () => void
  onOpenDetail?: () => void
}
