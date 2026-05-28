import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/common/core/button'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'

interface ClaimPreviewFooterProps {
  staffName?: string | null
  staffAvatarUrl?: string | null
  isTakingOn?: boolean
  onTakeIt?: () => void
  onOpenDetail?: () => void
}

export function ClaimPreviewFooter({
  staffName,
  staffAvatarUrl,
  isTakingOn,
  onTakeIt,
  onOpenDetail,
}: ClaimPreviewFooterProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-[#ebebeb]">
      <ClaimAssignee name={staffName} avatarUrl={staffAvatarUrl} />

      <div className="flex items-center gap-2">
        {onTakeIt && (
          <Button size="sm" onClick={onTakeIt} disabled={isTakingOn} className='cursor-pointer'>
            <Check className="w-3.5 h-3.5" />
            Take it on
          </Button>
        )}
        {onOpenDetail && (
          <Button size="sm" onClick={onOpenDetail} className='cursor-pointer'>
            <ArrowRight className="w-3.5 h-3.5" />
            Open full detail
          </Button>
        )}
      </div>
    </div>
  )
}
