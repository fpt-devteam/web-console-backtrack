import { Avatar } from '@/components/common/avatar'

interface ClaimCardPartnerProps {
  name: string
  avatarUrl?: string | null
}

export function ClaimCardPartner({ name, avatarUrl }: ClaimCardPartnerProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-mute">by</span>
      <Avatar url={avatarUrl} name={name} className="w-5 h-5 rounded-full text-[9px]" />
      <span className="text-sm text-black font-medium truncate">{name}</span>
    </div>
  )
}
