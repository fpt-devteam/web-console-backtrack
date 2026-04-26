import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Loader2, Paperclip, Send, Smile } from 'lucide-react'
import { Avatar } from './avatar'
import { TypingIndicator } from './typing-indicator'
import { bubbleClass, buildGroups, formatTime } from './utils'
import { auth } from '@/lib/firebase'
import { useChatMessages } from '@/hooks/use-chat'
import { useIncomingMessages, useMarkSeen, useSendMessage, useTypingIndicator } from '@/hooks/use-chat-socket'
import { MessageType } from '@/types/chat.types'

interface MessagePanelProps {
  conversationId: string
  partner?: { avatarUrl?: string | null; displayName?: string | null; email?: string | null } | null
  readOnly?: boolean
}

export function MessagePanel({ conversationId, partner, readOnly = false }: MessagePanelProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(conversationId)
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()

  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const currentUid = auth.currentUser?.uid

  useIncomingMessages(conversationId)

  useEffect(() => {
    markSeen(conversationId)
  }, [conversationId, markSeen])

  const allMessages = data?.pages.flatMap(p => p.messages) ?? []
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    send({ conversationId, type: MessageType.TEXT, content: trimmed })
    stopTyping()
    setText('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#ff385c]" />
      </div>
    )
  }

  const groups = buildGroups([...allMessages].reverse())

  return (
    <div
      className="flex-1 grid min-h-0"
      style={{ gridTemplateRows: 'minmax(0, 1fr) auto' }}
    >
      <div className="overflow-y-auto py-4 px-4 space-y-1 bg-white">
        {hasNextPage && (
          <div className="text-center py-2">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs text-[#ff385c] hover:underline disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
            </button>
          </div>
        )}

        {allMessages.length === 0 && (
          <p className="text-center text-sm text-[#929292] mt-8">No messages yet.</p>
        )}

        {groups.map((group, gi) => {
          const isOwn = group.senderId === currentUid
          const count = group.messages.length
          return (
            <div key={gi} className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
              {group.messages.map((msg, mi) => {
                const pos: 'only' | 'first' | 'middle' | 'last' =
                  count === 1 ? 'only' : mi === 0 ? 'first' : mi === count - 1 ? 'last' : 'middle'
                const isLast = mi === count - 1
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[72%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isOwn && (
                      <div className="w-7 flex-shrink-0">
                        {isLast && (
                          <div className="w-7 h-7 rounded-full overflow-hidden">
                            <Avatar
                              url={partner?.avatarUrl}
                              name={partner?.displayName ?? partner?.email ?? msg.senderId.slice(0, 2)}
                              className="w-7 h-7 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`text-sm ${msg.type === MessageType.IMAGE ? '' : `px-3.5 py-2 ${bubbleClass(isOwn, pos)}`}`}>
                      {msg.type === MessageType.IMAGE ? (
                        <img
                          src={msg.content}
                          alt="image"
                          className="max-w-[260px] max-h-[300px] rounded-2xl object-cover cursor-pointer"
                          onClick={() => window.open(msg.content, '_blank')}
                        />
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                      {isLast && (
                        <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-white/60 text-right' : 'text-[#929292]'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      <div>
        {!readOnly && <TypingIndicator conversationId={conversationId} />}
        {readOnly ? (
          <div className="px-4 py-3 border-t border-[#dddddd] text-center text-xs text-[#929292]">
            This conversation has been resolved.
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-[#dddddd]">
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#929292] hover:text-[#6a6a6a] transition-colors rounded-full hover:bg-[#f7f7f7]">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#929292] hover:text-[#6a6a6a] transition-colors rounded-full hover:bg-[#f7f7f7]">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#929292] hover:text-[#6a6a6a] transition-colors rounded-full hover:bg-[#f7f7f7]">
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1 flex items-center bg-[#f7f7f7] rounded-full px-4 py-2 gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message…"
                  value={text}
                  onChange={e => { setText(e.target.value); startTyping() }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-[#222222] placeholder-[#929292] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ff385c] text-white hover:bg-[#e00b41] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
