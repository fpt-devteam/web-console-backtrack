import { Avatar } from '@/components/common/avatar'
import { MessageBubble } from './message-bubble'
import type { IConversationPartner } from '@/types/chat.types'
import type { MessageGroup as MessageGroupType } from '../chat.types'

interface MessageGroupProps {
  group: MessageGroupType
  isOwn: boolean
  partner?: IConversationPartner | null
}

export function MessageGroup({ group, isOwn, partner }: MessageGroupProps) {
  const count = group.messages.length
  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      {group.messages.map((msg, mi) => {
        const pos = count === 1 ? 'only' : mi === 0 ? 'first' : mi === count - 1 ? 'last' : 'middle'
        const isLast = mi === count - 1
        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2 max-w-[72%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!isOwn && (
              <div className="w-7 flex-shrink-0">
                {isLast && (
                  <Avatar
                    url={partner?.avatarUrl}
                    name={partner?.displayName ?? partner?.email ?? msg.senderId.slice(0, 2)}
                    className="w-7 h-7 rounded-full"
                  />
                )}
              </div>
            )}
            <MessageBubble
              type={msg.type}
              content={msg.content}
              createdAt={msg.createdAt}
              isOwn={isOwn}
              position={pos}
              showTimestamp={isLast}
            />
          </div>
        )
      })}
    </div>
  )
}
