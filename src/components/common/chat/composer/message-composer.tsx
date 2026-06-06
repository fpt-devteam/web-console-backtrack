import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Send } from 'lucide-react'

interface QuickReply {
  label: string
  text: string
  /** Optional group label; chips sharing a section render together under it. */
  section?: string
}

interface MessageComposerProps {
  onSend: (text: string) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
  placeholder?: string
  disabled?: boolean
  /** Optional one-tap reply templates shown as chips above the input. */
  quickReplies?: QuickReply[]
}

export function MessageComposer({
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = 'Type your message…',
  disabled = false,
  quickReplies,
}: MessageComposerProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Grow the textarea with its content, up to the CSS max-height (then it scrolls).
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    onTypingStop?.()
    setText('')
    inputRef.current?.focus()
  }

  // Drop the template into the input so staff can review/edit before sending.
  function handleQuickReply(value: string) {
    setText(value)
    onTypingStart?.()
    inputRef.current?.focus()
  }

  // Enter sends; Shift+Enter inserts a newline.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // Group chips by section, preserving first-seen order. Chips without a
  // section render first, in an unlabeled row.
  const quickReplyGroups: { section?: string; replies: QuickReply[] }[] = []
  for (const qr of quickReplies ?? []) {
    let group = quickReplyGroups.find((g) => g.section === qr.section)
    if (!group) { group = { section: qr.section, replies: [] }; quickReplyGroups.push(group) }
    group.replies.push(qr)
  }

  return (
    <div className="px-4 py-3 border-t border-[#dddddd] bg-white">
      {quickReplyGroups.length > 0 && (
        <div className="space-y-1.5 mb-1">
          {quickReplyGroups.map((group) => (
            <div key={group.section ?? '__default__'}>
              {group.section && (
                <div className="px-0.5 pb-1 text-[10px] font-medium uppercase tracking-wide text-mute">
                  {group.section}
                </div>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {group.replies.map((qr) => (
                  <button
                    key={qr.label}
                    type="button"
                    onClick={() => handleQuickReply(qr.text)}
                    disabled={disabled}
                    title={qr.text}
                    className="shrink-0 px-3 py-1 rounded-full border border-[#dddddd] text-xs text-ash bg-white hover:bg-cloud hover:border-ink hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <button className="p-2 text-mute hover:text-ash transition-colors rounded-full hover:bg-cloud shrink-0">
          <ImageIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-end bg-gray-200 rounded-2xl px-5 py-2 gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            onChange={e => { setText(e.target.value); onTypingStart?.() }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-xs text-ink placeholder-mute focus:outline-none disabled:cursor-not-allowed resize-none max-h-32 overflow-y-auto leading-relaxed whitespace-pre-wrap break-words"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-rausch text-white hover:bg-rausch-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
