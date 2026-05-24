import type { ClaimPreviewDialogProps } from './claim-preview-dialog.types'
import { ClaimPreviewHeader } from './claim-preview-header'
import { ClaimPreviewItemSection } from './claim-preview-item-section'
import { ClaimPreviewCustomerSection } from './claim-preview-customer-section'
import { ClaimPreviewMessageSection } from './claim-preview-message-section'
import { ClaimPreviewFooter } from './claim-preview-footer'

export function ClaimPreviewDialog({ conv, onClose, onTakeIt, onOpenDetail }: ClaimPreviewDialogProps) {
  const staffProfile = conv.assignedStaff
  const statusKey = conv.status
  const staffName = staffProfile?.displayName ?? staffProfile?.email ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ClaimPreviewHeader claimId={conv.id} status={statusKey} onClose={onClose} />

        <div className="overflow-y-auto flex flex-col gap-4 py-4">
          <ClaimPreviewItemSection supportFormData={conv.supportFormData} createdAt={conv.createdAt} />

          <ClaimPreviewCustomerSection
            partner={conv.partner}
            lastActivityAt={conv.lastMessageAt}
          />

          <ClaimPreviewMessageSection message={conv.lastMessageContent} />
        </div>

        <ClaimPreviewFooter
          staffName={staffName}
          staffAvatarUrl={staffProfile?.avatarUrl}
          onTakeIt={onTakeIt}
          onOpenDetail={onOpenDetail}
        />
      </div>
    </div>
  )
}
