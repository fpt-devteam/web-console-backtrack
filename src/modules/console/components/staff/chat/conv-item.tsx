import { Avatar } from './avatar'
import { formatTime, statusBadge, statusLabel } from './utils'
import type { IConversation } from '@/types/chat.types'
import { ConversationStatus } from '@/types/chat.types'

interface ConvItemProps {
  conv: IConversation
  isActive: boolean
  onSelect: () => void
}

export function ConvItem({ conv, isActive, onSelect }: ConvItemProps) {
  const name = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  const hasUnread = (conv.unreadCount ?? 0) > 0
  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left
        ${isActive ? 'bg-[#fff0f2]' : 'hover:bg-[#f7f7f7]'}`}
    >
      <div className="relative flex-shrink-0">
        <Avatar url={conv.partner?.avatarUrl} name={name} className="w-12 h-12 rounded-full" />
        {conv.status === ConversationStatus.IN_PROGRESS && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className={`text-sm truncate ${hasUnread ? 'font-semibold text-[#222222]' : 'font-medium text-[#222222]'}`}>
            {name}
          </span>
          <span className="text-[11px] text-[#929292] flex-shrink-0">
            {formatTime(conv.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className={`text-xs truncate ${hasUnread ? 'font-medium text-[#6a6a6a]' : 'text-[#929292]'}`}>
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>
          {hasUnread && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-[#ff385c] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {conv.unreadCount}
            </span>
          )}
        </div>

        {conv.status && (
          <span className={`text-[10px] font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${statusBadge(conv.status)}`}>
            {statusLabel(conv.status)}
          </span>
        )}
      </div>
    </button>
  )
}
