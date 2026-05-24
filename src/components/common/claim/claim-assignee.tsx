import { UserCircle2 } from 'lucide-react'
import { Avatar } from '@/components/common/avatar'

interface ClaimAssigneeProps {
  name?: string | null
  avatarUrl?: string | null
}

export function ClaimAssignee({ name, avatarUrl }: ClaimAssigneeProps) {
  if (!name) {
    return (
      <div className="flex items-center gap-2 text-mute">
        <UserCircle2 className="w-5 h-5 shrink-0" />
        <span className="text-sm">Unassigned</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <Avatar url={avatarUrl} name={name} className="w-6 h-6 rounded-full text-[9px] shrink-0" />
      <span className="text-sm font-medium text-ink/80">{name}</span>
    </div>
  )
}
