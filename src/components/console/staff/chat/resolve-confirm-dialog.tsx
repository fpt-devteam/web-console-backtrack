import { CheckCircle, Loader2, X } from 'lucide-react'
import { Avatar } from './avatar'

interface ResolveConfirmDialogProps {
  partnerName: string
  avatarUrl?: string
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ResolveConfirmDialog({ partnerName, avatarUrl, isPending, onConfirm, onCancel }: ResolveConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fff0f2] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#ff385c]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] text-sm">Resolve conversation?</h3>
              <p className="text-xs text-[#929292] mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-[#929292] hover:text-[#6a6a6a] transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#f7f7f7] rounded-xl p-3 mb-5 flex items-center gap-3">
          <Avatar url={avatarUrl} name={partnerName} className="w-10 h-10 rounded-full flex-shrink-0" />
          <p className="text-sm font-medium text-[#222222] truncate">{partnerName}</p>
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
              <><Loader2 className="w-4 h-4 animate-spin" /> Resolving…</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Mark as resolved</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
