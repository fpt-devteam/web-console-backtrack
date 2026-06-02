import { MessageType } from '@/types/chat.types'
import { bubbleClass, formatTime } from '../chat.utils'
import type { BubblePosition } from '../chat.types'

interface MessageBubbleProps {
  type: MessageType
  content: string
  createdAt: string
  isOwn: boolean
  position: BubblePosition
  showTimestamp?: boolean
}

export function MessageBubble({ type, content, createdAt, isOwn, position, showTimestamp }: MessageBubbleProps) {
  if (type === MessageType.IMAGE) {
    return (
      <div>
        <img
          src={content}
          alt="image"
          className="max-w-[260px] max-h-[300px] rounded-2xl object-cover cursor-pointer"
          onClick={() => window.open(content, '_blank')}
        />
        {showTimestamp && (
          <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-white/60 text-right' : 'text-[#929292]'}`}>
            {formatTime(createdAt)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`text-sm px-3.5 py-2 ${bubbleClass(isOwn, position)}`}>
      <p className="leading-relaxed whitespace-pre-wrap break-words">{content}</p>
      {showTimestamp && (
        <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-white/60 text-right' : 'text-[#929292]'}`}>
          {formatTime(createdAt)}
        </p>
      )}
    </div>
  )
}
