import { CheckCircle2, Loader2 } from 'lucide-react'
import { Avatar } from './avatar'

interface ChatHeaderProps {
  partnerName: string
  avatarUrl?: string | null
  isResolved: boolean
  isResolvePending: boolean
  onResolve: () => void
}

export function ChatHeader({ partnerName, avatarUrl, isResolved, isResolvePending, onResolve }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 px-5 py-3 border-b border-[#dddddd] flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar url={avatarUrl} name={partnerName} className="w-10 h-10 rounded-full" />
          {!isResolved && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-[#222222] text-sm leading-tight">{partnerName}</h3>
          <p className={`text-xs font-medium ${isResolved ? 'text-[#929292]' : 'text-[#06c167]'}`}>
            {isResolved ? 'Resolved' : 'Active now'}
          </p>
        </div>
      </div>
      {!isResolved && (
        <button
          onClick={onResolve}
          disabled={isResolvePending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {isResolvePending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Resolve
        </button>
      )}
    </div>
  )
}
