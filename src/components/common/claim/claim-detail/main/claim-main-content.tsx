import type { SupportFormData } from '@/types/chat.types'
import { ClaimItemCard } from './claim-item-card'

interface ClaimMainContentProps {
  supportFormData: SupportFormData
  onPrintSlip?: () => void
}

export function ClaimMainContent({ supportFormData, onPrintSlip }: ClaimMainContentProps) {
  return (
    <ClaimItemCard supportFormData={supportFormData} onPrintSlip={onPrintSlip} />
  )
}
