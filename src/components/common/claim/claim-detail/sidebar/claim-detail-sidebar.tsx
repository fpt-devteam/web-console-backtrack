import { Check } from 'lucide-react'
import { Button } from '@/components/common/core/button'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'
import type { IConversationPartner, ConversationStatus, SupportFormData } from '@/types/chat.types'
import { CustomerSection } from './customer-section'
import { ClaimStatusTrace } from './claim-status-trace'

interface ClaimDetailSidebarProps {
  partner: IConversationPartner
  createdAt?: string | null
  firstAssignedAt?: string | null
  resolvedAt?: string | null
  status: ConversationStatus
  assigneeName?: string | null
  assigneeAvatarUrl?: string | null
  isResolvePending?: boolean
  onResolve?: () => void
  onReturnToQueue?: () => void
  supportFormData?: SupportFormData | null
}

function SectionDivider() {
  return <div className="border-t border-hairline" />
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
  partner, createdAt, firstAssignedAt, resolvedAt, status,
  assigneeName, assigneeAvatarUrl,
  isResolvePending, onResolve, onReturnToQueue,
  supportFormData,
}: ClaimDetailSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-4">
        <CustomerSection partner={partner} supportFormData={supportFormData} />

        <SectionDivider />
          <ClaimInfoField label="Assignee">
            <ClaimAssignee name={assigneeName} avatarUrl={assigneeAvatarUrl} />
          </ClaimInfoField>
        <SectionDivider />

        <ClaimStatusTrace status={status} submittedAt={createdAt} firstAssignedAt={firstAssignedAt} resolvedAt={resolvedAt} />
      </div>

      {(onResolve || onReturnToQueue) && (
        <div className="shrink-0 h-20 border-t border-hairline px-4 flex items-center gap-2">
          {onResolve && (
            <Button size="sm" className="flex-1 hover:cursor-pointer" onClick={onResolve} disabled={isResolvePending}>
              <Check className="w-3.5 h-3.5" />
              Resolve
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
