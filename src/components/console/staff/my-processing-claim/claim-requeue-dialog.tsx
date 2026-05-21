import { Loader2, RotateCcw, X } from 'lucide-react'
import { Avatar } from '../../../common/avatar'
import type { IConversation } from '@/types/chat.types'

interface ClaimRequeueDialogProps {
  conv: IConversation
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ClaimRequeueDialog({ conv, isPending, onConfirm, onCancel }: ClaimRequeueDialogProps) {
  const label = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fff8e1] rounded-full flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] text-sm">Return to queue?</h3>
              <p className="text-xs text-[#929292] mt-0.5">This will unassign you from the conversation</p>
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
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#f59e0b] rounded-xl hover:bg-[#d97706] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Returning…</>
            ) : (
              <><RotateCcw className="w-4 h-4" /> Return to queue</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
