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
    <div className="flex-shrink-0 px-5 py-5 border-b border-[#dddddd] flex items-center justify-between bg-white">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar url={avatarUrl} name={partnerName} className="w-12 h-12 rounded-full" />
          {!isResolved && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-ink text-base leading-tight">{partnerName}</h3>
          <p className={`text-sm font-medium ${isResolved ? 'text-mute' : 'text-[#06c167]'}`}>
            {isResolved ? 'Resolved' : 'Active now'}
          </p>
        </div>
      </div>
      {!isResolved && (
        <button
          onClick={onResolve}
          disabled={isResolvePending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {isResolvePending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Resolve
        </button>
      )}
    </div>
  )
}
