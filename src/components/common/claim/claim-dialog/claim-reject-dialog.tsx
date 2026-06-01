import { Loader2, XCircle, X } from 'lucide-react'
import { Avatar } from '../../avatar'

interface ClaimRejectDialogProps {
  partnerName: string
  avatarUrl?: string | null
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ClaimRejectDialog({ partnerName, avatarUrl, isPending, onConfirm, onCancel }: ClaimRejectDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] text-sm">Reject this claim?</h3>
              <p className="text-xs text-[#929292] mt-0.5">The claim will be closed as resolved</p>
            </div>
          </div>
          <button onClick={onCancel} className="cursor-pointer text-[#929292] hover:text-[#6a6a6a] transition-colors p-1">
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
            className="cursor-pointer flex-1 px-4 py-2.5 text-sm font-medium text-[#222222] border border-[#dddddd] rounded-xl hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Rejecting…</>
            ) : (
              <><XCircle className="w-4 h-4" /> Reject claim</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
