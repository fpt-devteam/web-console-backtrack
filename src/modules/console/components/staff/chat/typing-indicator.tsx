import { useChatContext } from '@/contexts/chat.context'

export function TypingIndicator({ conversationId }: { conversationId: string }) {
  const { typingUsers } = useChatContext()
  const active = Object.values(typingUsers).filter(t => t.conversationId === conversationId)
  if (!active.length) return null
  return (
    <div className="flex items-end gap-2 px-4 pb-3">
      <div className="flex items-center gap-1 bg-[#f7f7f7] rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-[#929292] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
