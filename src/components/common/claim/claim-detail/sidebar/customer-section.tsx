import { User } from 'lucide-react'
import { Avatar } from '@/components/common/avatar'
import type { IConversationPartner } from '@/types/chat.types'
import { formatDateTime } from '@/utils/datetime.util'

interface CustomerSectionProps {
  partner: IConversationPartner
  lastContactAt?: string | null
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-bold tracking-widest text-ink uppercase">{label}</span>
      <span className="text-xs font-medium text-mute break-all">{value ?? '—'}</span>
    </div>
  )
}

export function CustomerSection({ partner, lastContactAt }: CustomerSectionProps) {
  const name = partner.displayName ?? partner.email ?? 'Unknown'
  const lastContact = lastContactAt ? formatDateTime(lastContactAt) : '—'

  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center gap-1.5 text-sm font-bold tracking-widest text-mute uppercase">
        <User className="w-5 h-5" />
        Customer
      </span>

      <div className="flex items-center gap-2.5">
        <Avatar url={partner.avatarUrl} name={name} className="w-10 h-10 rounded-full text-sm shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{name}</p>
          {partner.email && (
            <p className="text-xs text-mute truncate">{partner.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <Field label="Last contact" value={lastContact} />
      </div>
    </div>
  )
}
