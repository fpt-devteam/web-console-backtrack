import { UserCircle2 } from 'lucide-react'
import { Avatar } from '@/components/common/avatar'
import { cn } from '@/lib/utils'

interface ClaimAssigneeProps {
  name?: string | null
  avatarUrl?: string | null
  className?: string
}

export function ClaimAssignee({ name, avatarUrl, className }: ClaimAssigneeProps) {
  if (!name) {
    return (
      <div className="flex items-center gap-2 text-mute">
        <UserCircle2 className="w-5 h-5 shrink-0" />
        <span className={cn('text-sm', className)}>Unassigned</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <Avatar url={avatarUrl} name={name} className="w-6 h-6 rounded-full text-[9px] shrink-0" />
      <span className={cn('text-sm font-medium text-ink/80', className)}>{name}</span>
    </div>
  )
}
