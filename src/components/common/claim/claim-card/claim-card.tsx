import { useState, } from 'react'
import type { MouseEvent } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Loader2, UserCheck } from 'lucide-react'
import type { ClaimCardProps } from './claim-card.types'
import { getCardClassName, getPartnerName } from './claim-card.helper'
import { ClaimCardImage } from './claim-card-image'
import { ClaimCardHeader } from './claim-card-header'
import { ClaimCardPartner } from './claim-card-partner'
import { ClaimCardMeta } from './claim-card-meta'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'
import { Button } from '@/components/common/core/button'
import { ConversationStatus } from '@/types/chat.types'

export function ClaimCard({ conv, disabled = false, onOpenConversation, onTakeOn }: ClaimCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: conv.id,
    data: { status: conv.status },
    disabled,
  })
  const [isTakingOn, setIsTakingOn] = useState(false)

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const statusKey   = conv.status
  const partnerName = getPartnerName(conv)
  const itemName    = conv.supportFormData.itemName
  const imageUrl    = conv.supportFormData.imageUrls?.[0] ?? null
  const category    = conv.supportFormData.category

  const canTakeOn = !!onTakeOn && statusKey === ConversationStatus.QUEUE

  function handleCardClick() {
    if (isDragging) return
    onOpenConversation?.(conv)
  }

  async function handleTakeOn(e: MouseEvent) {
    e.stopPropagation()
    if (!onTakeOn || isTakingOn) return
    setIsTakingOn(true)
    try {
      await onTakeOn(conv)
    } finally {
      setIsTakingOn(false)
    }
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
        <ClaimCardImage src={imageUrl} alt={itemName} category={category} />

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <ClaimCardHeader id={conv.id} itemName={itemName} status={statusKey} />

          <ClaimCardPartner name={partnerName} avatarUrl={conv.partner.avatarUrl} />

          <p className="text-xs text-mute truncate">
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>

          <ClaimCardMeta category={category} lastMessageAt={conv.lastMessageAt} />
        </div>
      </div>

      <div className="border-t border-hairline px-3 py-2 flex items-center justify-between gap-2">
        <ClaimAssignee name={conv.assignedStaff?.displayName} avatarUrl={conv.assignedStaff?.avatarUrl} />
        {canTakeOn && (
          <Button size="xs" onClick={handleTakeOn} disabled={isTakingOn} className="shrink-0">
            {isTakingOn ? <Loader2 className="animate-spin" /> : <UserCheck />}
            Take on
          </Button>
        )}
      </div>
    </div>
  )
}
