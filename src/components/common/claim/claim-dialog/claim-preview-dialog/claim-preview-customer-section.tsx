import { Avatar } from '@/components/common/avatar'
import type { IConversationPartner } from '@/types/chat.types'

interface ClaimPreviewCustomerSectionProps {
  partner: IConversationPartner
  lastActivityAt?: string | null
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ClaimPreviewCustomerSection({ partner, lastActivityAt }: ClaimPreviewCustomerSectionProps) {
  const name = partner.displayName ?? partner.email ?? 'Unknown'

  return (
    <div className="mx-5 px-4 py-3 bg-[#f7f7f7] rounded-xl flex items-center gap-3">
      <Avatar url={partner.avatarUrl} name={name} className="w-10 h-10 rounded-full text-sm shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{name}</p>
        {partner.email && (
          <p className="text-xs text-mute truncate">{partner.email}</p>
        )}
      </div>
      {lastActivityAt && (
        <span className="text-xs text-mute shrink-0 bg-white px-2.5 py-1 rounded-full border border-[#ebebeb]">
          {timeAgo(lastActivityAt)} · last activity
        </span>
      )}
    </div>
  )
}
