import { Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/common/core/button'

interface ClaimDecisionBarProps {
  isResolvePending?: boolean
  isReturnPending?: boolean
  onResolve?: () => void
  onReturnToQueue?: () => void
}

export function ClaimDecisionBar({
  isResolvePending,
  isReturnPending,
  onResolve,
  onReturnToQueue,
}: ClaimDecisionBarProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-b border-hairline bg-white shrink-0">
      {onReturnToQueue && (
        <Button variant="outline" size="sm" onClick={onReturnToQueue} disabled={isReturnPending}>
          <RotateCcw className="w-3.5 h-3.5" />
          Return to queue
        </Button>
      )}
      {onResolve && (
        <Button size="sm" onClick={onResolve} disabled={isResolvePending}>
          <Check className="w-3.5 h-3.5" />
          Resolve
        </Button>
      )}
    </div>
  )
}
