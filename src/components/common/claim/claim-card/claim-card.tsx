import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { ClaimCardProps } from './claim-card.types'
import { getCardClassName, getPartnerName } from './claim-card.helper'
import { ClaimCardImage } from './claim-card-image'
import { ClaimCardHeader } from './claim-card-header'
import { ClaimCardPartner } from './claim-card-partner'
import { ClaimCardMeta } from './claim-card-meta'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'
import { useSubcategories } from '@/hooks/use-subcategories'
import { useMatchingInventoryCount } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { getSubcategoryIcon } from '@/utils/subcategory-icon'
import type { ItemCategory } from '@/services/inventory.service'

export function ClaimCard({ conv, disabled = false, onOpenConversation }: ClaimCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: conv.id,
    data: { status: conv.status },
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const statusKey   = conv.status
  const partnerName = getPartnerName(conv)
  const itemName    = conv.supportFormData.itemName
  const imageUrl    = conv.supportFormData.imageUrls?.[0] ?? null
  const category    = conv.supportFormData.category

  const { data: subcategories } = useSubcategories()
  const subcategoryCode = subcategories?.find((s) => s.id === conv.supportFormData.subCategoryId)?.code
  const subcategoryIcon = subcategoryCode ? getSubcategoryIcon(category as ItemCategory, subcategoryCode) : null

  // In-storage items of the same subcategory the staff could match this claim against.
  const { currentOrgId } = useCurrentOrgId()
  const matchCount = useMatchingInventoryCount(currentOrgId, category, conv.supportFormData.subCategoryId)

  const interactive = !!onOpenConversation

  function handleCardClick() {
    if (isDragging || !interactive) return
    onOpenConversation?.(conv)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={getCardClassName(isDragging, interactive)}
    >
      <div className="h-3 flex items-center justify-center">
        {!disabled && (
          <div
            {...listeners}
            {...attributes}
            className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-3 h-3 text-neutral-300" />
          </div>
        )}
      </div>

      <div className={`flex gap-2 px-2 pb-2 pt-0 min-h-30`}>
        <ClaimCardImage src={imageUrl} alt={itemName} category={category} subcategoryIcon={subcategoryIcon} />

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <ClaimCardHeader id={conv.id} itemName={itemName} status={statusKey} />

          <ClaimCardPartner name={partnerName} avatarUrl={conv.partner.avatarUrl} />

          <ClaimCardMeta category={category} lastMessageAt={conv.lastMessageAt} matchCount={matchCount} />
        </div>
      </div>

      <div className="border-t border-hairline px-3 py-2">
        <ClaimAssignee name={conv.assignedStaff?.displayName} avatarUrl={conv.assignedStaff?.avatarUrl} />
      </div>
    </div>
  )
}
