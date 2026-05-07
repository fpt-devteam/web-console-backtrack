import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ImageOff, UserCircle2 } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Avatar } from '@/modules/console/components/staff/chat/avatar'
import { formatTime, statusLabel } from '@/modules/console/components/staff/chat/utils'
import type { IConversation } from '@/types/chat.types'
import { ConversationStatus } from '@/types/chat.types'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useUserById } from '@/hooks/use-user'

interface ConversationCardProps {
  conv: IConversation
  disabled?: boolean
}

const STATUS_BADGE: Record<ConversationStatus, string> = {
  [ConversationStatus.QUEUE]:       'bg-amber-50 text-amber-600 border border-amber-200',
  [ConversationStatus.IN_PROGRESS]: 'bg-green-50 text-green-700 border border-green-200',
  [ConversationStatus.CLOSED]:      'bg-neutral-100 text-neutral-500 border border-neutral-200',
}

const STATUS_DOT: Record<ConversationStatus, string> = {
  [ConversationStatus.QUEUE]:       'bg-amber-400',
  [ConversationStatus.IN_PROGRESS]: 'bg-green-500',
  [ConversationStatus.CLOSED]:      'bg-neutral-400',
}

export function ConversationCard({ conv, disabled = false }: ConversationCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: conv.id,
    data: { status: conv.status },
    disabled,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const { currentOrgId } = useCurrentOrgId()
  const { data: orgInventory, isLoading } = useInventoryItem(currentOrgId, conv.supportFormData ? conv.supportFormData.postId : null)
  const { data: staffProfile } = useUserById(conv.assignedStaffId)
  const navigate = useNavigate()
  const { slug } = useParams({ strict: false })

  if (isLoading || !orgInventory) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-xl border border-hairline shadow-sm h-28 animate-pulse"
      />
    )
  }

  const partnerName = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  const itemName    = orgInventory.postTitle
  const itemThumb   = orgInventory.imageUrls[0]
  const category    = orgInventory.category
  const statusKey   = conv.status ?? ConversationStatus.QUEUE
  const postId      = conv.supportFormData?.postId

  function handleCardClick() {
    if (!slug || !postId || isDragging) return
    void navigate({ to: '/console/$slug/staff/item/$itemId', params: { slug, itemId: postId } })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={[
        'relative bg-white rounded-xl border border-hairline shadow-sm select-none group',
        'transition-shadow hover:shadow-md',
        isDragging ? 'shadow-xl ring-2 ring-primary/30' : '',
        'cursor-pointer',
      ].join(' ')}
    >
      {/* Status badge — absolute top-right */}
      <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[statusKey]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[statusKey]}`} />
        {statusLabel(statusKey)}
      </span>

      {/* Drag handle — appears on hover */}
      {!disabled && (
        <div
          {...listeners}
          {...attributes}
          className="flex items-center justify-center h-5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-neutral-300" />
        </div>
      )}

      <div className={`flex gap-3 px-3 pb-3 ${!disabled ? 'pt-0' : 'pt-3'}`}>
        {/* Item image */}
        <div className="shrink-0">
          {itemThumb ? (
            <img
              src={itemThumb}
              alt={itemName}
              className="w-14 h-14 rounded-xl object-cover border border-hairline"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-hairline flex items-center justify-center">
              <ImageOff className="w-5 h-5 text-neutral-300" />
            </div>
          )}
        </div>

        {/* Right content — extra right padding so text doesn't run under the badge */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 pr-16">
          {/* Item name */}
          <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
            {itemName}
          </p>

          {/* Partner row */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-mute">by</span>
            <Avatar
              url={conv.partner?.avatarUrl}
              name={partnerName}
              className="w-4 h-4 rounded-full text-[8px]"
            />
            <span className="text-[11px] text-mute font-medium truncate">
              {partnerName}
            </span>
          </div>

          {/* Last message */}
          <p className="text-xs text-mute truncate">
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>

          {/* Category / time */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-mute/70 truncate">{category}</span>
            <span className="text-[10px] text-mute/70 ml-auto shrink-0">
              {formatTime(conv.lastMessageAt)}
            </span>
          </div>

          {/* Staff section */}
          <div className="border-t border-hairline pt-2 mt-0.5">
            {staffProfile ? (
              <div className="flex items-center gap-1.5">
                <Avatar
                  url={staffProfile.avatarUrl}
                  name={staffProfile.displayName ?? staffProfile.name ?? ''}
                  className="w-5 h-5 rounded-full text-[9px] shrink-0"
                />
                <span className="text-[11px] font-medium text-ink/80 truncate">
                  {staffProfile.displayName ?? staffProfile.name}
                </span>
                <span className="text-[10px] text-mute/60 ml-auto shrink-0">handling</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-mute/50">
                <UserCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[11px]">Unassigned</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
