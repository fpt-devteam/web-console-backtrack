import { Mail, Phone, User } from 'lucide-react'
import { Avatar } from '@/components/common/avatar'
import type { IConversationPartner, SupportFormData } from '@/types/chat.types'

interface CustomerSectionProps {
  partner: IConversationPartner
  supportFormData?: SupportFormData | null
}

function ContactRow({ icon: Icon, label, value, href }: {
  icon: typeof User
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-3.5 h-3.5 text-mute mt-0.5 shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">{label}</span>
        {href ? (
          <a href={href} className="text-xs text-primary hover:underline break-words">{value}</a>
        ) : (
          <span className="text-xs text-ink break-words">{value}</span>
        )}
      </div>
    </div>
  )
}

export function CustomerSection({ partner, supportFormData }: CustomerSectionProps) {
  const name = partner.displayName ?? partner.email ?? 'Unknown'

  const contactPhone = supportFormData?.contactPhone?.trim()
  const contactEmail = supportFormData?.contactEmail?.trim()

  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center gap-1.5 text-sm font-bold tracking-widest text-mute uppercase">
        <User className="w-5 h-5" />
        Customer
      </span>

      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar url={partner.avatarUrl} name={name} className="w-10 h-10 rounded-full text-sm shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">Name</span>
            <span className="text-sm text-ink break-words">{name}</span>
          </div>
        </div>

        {contactPhone && <ContactRow icon={Phone} label="Phone" value={contactPhone} href={`tel:${contactPhone}`} />}
        {contactEmail && <ContactRow icon={Mail}  label="Email" value={contactEmail} href={`mailto:${contactEmail}`} />}
      </div>
    </div>
  )
}
