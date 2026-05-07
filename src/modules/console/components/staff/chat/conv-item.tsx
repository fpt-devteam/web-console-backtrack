import { ImageOff } from 'lucide-react'
import { Avatar } from './avatar'
import { formatTime } from './utils'
import type { IConversation } from '@/types/chat.types'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'

interface ConvItemProps {
  conv: IConversation
  isActive: boolean
  onSelect: () => void
}

export function ConvItem({ conv, isActive, onSelect }: ConvItemProps) {
  const { currentOrgId } = useCurrentOrgId()
  const { data: orgInventory, isLoading } = useInventoryItem(
    currentOrgId,
    conv.supportFormData ? conv.supportFormData.postId : null,
  )

  if (isLoading || !orgInventory) {
    return null
  }

  const partnerName =
    conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  const itemName = orgInventory.postTitle
  const itemThumb = orgInventory.imageUrls[0]
  const category = orgInventory.category

  const hasUnread = (conv.unreadCount ?? 0) > 0

  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left transition-colors',
        'border-b border-hairline last:border-b-0',
        isActive ? 'bg-[#fff0f2]' : 'bg-white hover:bg-[#f7f7f7]',
      ].join(' ')}
    >
      <div className="flex gap-3 px-4 py-3">
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

        {/* Right content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Item / partner name + unread */}
          <div className="flex items-start justify-between gap-1">
            <p
              className={`text-sm leading-snug line-clamp-2 ${hasUnread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}
            >
              {partnerName}
            </p>
            {hasUnread && (
              <span className="shrink-0 min-w-4.5 h-4.5 bg-[#ff385c] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 mt-0.5">
                {conv.unreadCount}
              </span>
            )}
          </div>

          {/* Partner row */}
          <div className="flex items-center gap-1">
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
          <p
            className={`text-xs truncate ${hasUnread ? 'font-medium text-[#6a6a6a]' : 'text-mute'}`}
          >
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>

          {/* Category / time footer */}
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="text-[10px] text-mute/70 truncate">
              {category}
            </span>
            <span className="text-[10px] text-mute/70 ml-auto shrink-0">
              {formatTime(conv.lastMessageAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
