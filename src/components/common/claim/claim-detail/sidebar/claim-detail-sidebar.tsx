import { Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'
import type { IConversationPartner, ConversationStatus, SupportFormData } from '@/types/chat.types'
import { CustomerSection } from './customer-section'
import { ClaimStatusTrace } from './claim-status-trace'

interface ClaimDetailSidebarProps {
  partner: IConversationPartner
  createdAt?: string | null
  firstAssignedAt?: string | null
  verifiedAt?: string | null
  resolvedAt?: string | null
  status: ConversationStatus
  assigneeName?: string | null
  assigneeAvatarUrl?: string | null
  /** Whether Accept is enabled (a matching item is linked or chosen). Reject is always available. */
  canAccept?: boolean
  isActionPending?: boolean
  onAccept?: () => void
  onReject?: () => void
  supportFormData?: SupportFormData | null
}

function ClaimInfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold tracking-widest text-mute uppercase">{label}</span>
      <div className="text-sm text-ink">{children}</div>
    </div>
  )
}

export function ClaimDetailSidebar({
  partner, createdAt, firstAssignedAt, verifiedAt, resolvedAt, status,
  assigneeName, assigneeAvatarUrl,
  canAccept, isActionPending, onAccept, onReject,
  supportFormData,
}: ClaimDetailSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto flex flex-col gap-10 p-4">
        <CustomerSection partner={partner} supportFormData={supportFormData} />

        <ClaimInfoField label="Assignee">
          <ClaimAssignee name={assigneeName} avatarUrl={assigneeAvatarUrl} />
        </ClaimInfoField>

        <ClaimStatusTrace status={status} submittedAt={createdAt} firstAssignedAt={firstAssignedAt} verifiedAt={verifiedAt} resolvedAt={resolvedAt} />
      </div>

      {(onAccept || onReject) && (
        <div className="shrink-0 border-t border-hairline px-4 py-3 flex flex-col gap-2">
          {onAccept && !canAccept && (
            <p className="text-xs text-mute">Choose a matching item to enable Accept.</p>
          )}
          <div className="flex items-center gap-2">
            {onReject && (
              <button
                type="button"
                onClick={onReject}
                disabled={isActionPending}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  'border-rose-200 text-rose-600 hover:bg-rose-50 hover:cursor-pointer',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            )}
            {onAccept && (
              <button
                type="button"
                onClick={onAccept}
                disabled={!canAccept || isActionPending}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors',
                  'bg-green-600 hover:bg-green-700 hover:cursor-pointer',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                {isActionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Accept
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
