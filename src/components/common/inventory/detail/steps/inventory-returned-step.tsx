import { useConversation } from '@/hooks/use-chat'
import { Avatar } from '@/components/common/avatar'
import { STATUS_BADGE, STATUS_LABEL } from '@/components/common/claim/claim.constants'
import { formatClaimId } from '@/components/common/claim/claim.utils'
import { DetailRow, SectionTitle } from '../inventory-detail-primitives'
import { formatDateTimeOrDash, formatOrDash } from '../inventory-detail-format'

function LinkedClaimRequest({ claimRequestId, orgId }: { claimRequestId: string; orgId?: string | null }) {
  const { data: conv, isLoading } = useConversation(claimRequestId, orgId ?? undefined)

  if (isLoading) {
    return <div className="h-16 rounded-xl bg-gray-50 animate-pulse" />
  }
  if (!conv) return null

  const name = conv.partner.displayName ?? conv.partner.email ?? conv.id.slice(0, 8)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3">
      <Avatar url={conv.partner.avatarUrl} name={name} className="w-10 h-10 rounded-full shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-mute">{formatClaimId(conv.id)}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[conv.status]}`}>
            {STATUS_LABEL[conv.status]}
          </span>
        </div>
        <p className="truncate text-sm font-medium text-ink">{name}</p>
        <p className="truncate text-xs text-mute">{conv.supportFormData?.itemName}</p>
      </div>
    </div>
  )
}

export function InventoryReturnedStep({ returnReportForPost, orgId }: { returnReportForPost: any; orgId?: string | null }) {
  const claimRequestId: string | null = returnReportForPost?.claimRequestId ?? null

  return (
    <div className="space-y-5">
      {claimRequestId && (
        <>
          <SectionTitle title="Linked claim request" />
          <LinkedClaimRequest claimRequestId={claimRequestId} orgId={orgId} />
        </>
      )}

      <SectionTitle title="Recipient — contact & ID" />
      <div className="rounded-xl bg-gray-50 px-4">
        <DetailRow label="Full name" value={formatOrDash(returnReportForPost?.ownerInfo?.ownerName)} />
        <DetailRow label="Email" value={formatOrDash(returnReportForPost?.ownerInfo?.email)} />
      </div>

      <SectionTitle title="Recipient — identification" />
      <div className="rounded-xl bg-gray-50 px-4">
        <DetailRow label="National ID / citizen ID" value={formatOrDash(returnReportForPost?.ownerInfo?.nationalId)} />
        <DetailRow label="Student / staff ID" value={formatOrDash(returnReportForPost?.ownerInfo?.orgMemberId)} />
        <DetailRow label="Phone number" value={formatOrDash(returnReportForPost?.ownerInfo?.phone)} />
      </div>

      <SectionTitle title="Return release" />
      <div className="rounded-xl bg-gray-50 px-4">
        <DetailRow label="Returned at" value={formatDateTimeOrDash(returnReportForPost?.createdAt)} />
        <DetailRow label="Releasing staff" value={formatOrDash(returnReportForPost?.staff?.displayName)} />
      </div>

      {(returnReportForPost?.evidenceImageUrls?.length ?? 0) > 0 && (
        <>
          <SectionTitle title="Evidence photos" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(returnReportForPost.evidenceImageUrls ?? []).map((url: string, idx: number) => (
              <a
                key={`${url}:${idx}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
                title="Open image"
              >
                <img
                  src={url}
                  alt={`Evidence ${idx + 1}`}
                  className="w-full h-28 object-contain bg-white"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
