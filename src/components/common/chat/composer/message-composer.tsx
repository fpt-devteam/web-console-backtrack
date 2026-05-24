import { useRef, useState } from 'react'
import { Image as ImageIcon, Send } from 'lucide-react'

interface MessageComposerProps {
  onSend: (text: string) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
  placeholder?: string
  disabled?: boolean
}

export function MessageComposer({
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = 'Type your message…',
  disabled = false,
}: MessageComposerProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    onTypingStop?.()
    setText('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="px-4 py-4 border-t border-[#dddddd]">
      <div className="flex items-center gap-2">
        <button className="p-2 text-mute hover:text-ash transition-colors rounded-full hover:bg-cloud">
          <ImageIcon className="w-6 h-6" />
        </button>

        <div className="flex-1 flex items-center bg-[#e8e8e8] rounded-full px-5 py-3 gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            onChange={e => { setText(e.target.value); onTypingStart?.() }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-base text-ink placeholder-mute focus:outline-none disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-rausch text-white hover:bg-rausch-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
