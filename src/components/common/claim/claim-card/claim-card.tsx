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

  function handleCardClick() {
    if (isDragging) return
    onOpenConversation?.(conv)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={getCardClassName(isDragging)}
    >
      <div className="h-5 flex items-center justify-center">
        {!disabled && (
          <div
            {...listeners}
            {...attributes}
            className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-neutral-300" />
          </div>
        )}
      </div>

      <div className={`flex gap-3 px-3 pb-3 pt-0 min-h-40`}>
        <ClaimCardImage src={imageUrl} alt={itemName} category={category} subcategoryIcon={subcategoryIcon} />

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <ClaimCardHeader id={conv.id} itemName={itemName} status={statusKey} />

          <ClaimCardPartner name={partnerName} avatarUrl={conv.partner.avatarUrl} />

          <p className="text-xs text-mute truncate">
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>

          <ClaimCardMeta category={category} lastMessageAt={conv.lastMessageAt} />
        </div>
      </div>

      <div className="border-t border-hairline px-3 py-2">
        <ClaimAssignee name={conv.assignedStaff?.displayName} avatarUrl={conv.assignedStaff?.avatarUrl} />
      </div>
    </div>
  )
}
