import { Loader2, UserCheck, X } from 'lucide-react'
import { Avatar } from './avatar'
import type { IConversation } from '@/types/chat.types'

interface AssignConfirmDialogProps {
  conv: IConversation
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AssignConfirmDialog({ conv, isPending, onConfirm, onCancel }: AssignConfirmDialogProps) {
  const label = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fff0f2] rounded-full flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-[#ff385c]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] text-sm">Assign conversation?</h3>
              <p className="text-xs text-[#929292] mt-0.5">This will assign the chat to you</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-[#929292] hover:text-[#6a6a6a] transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#f7f7f7] rounded-xl p-3 mb-5 flex items-center gap-3">
          <Avatar url={conv.partner?.avatarUrl} name={label} className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#222222] truncate">{label}</p>
            {conv.lastMessageContent && (
              <p className="text-xs text-[#929292] truncate">{conv.lastMessageContent}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[#222222] border border-[#dddddd] rounded-xl hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#ff385c] rounded-xl hover:bg-[#e00b41] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Assigning…</>
            ) : (
              <><UserCheck className="w-4 h-4" /> Assign to me</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
