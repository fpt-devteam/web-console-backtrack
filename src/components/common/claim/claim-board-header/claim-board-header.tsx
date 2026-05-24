import { cn } from '@/lib/utils'
import { ClaimSearchBar } from './claim-search-bar'

interface ClaimBoardHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  className?: string
}

export function ClaimBoardHeader({ searchTerm, onSearchChange, className }: ClaimBoardHeaderProps) {
  return (
    <div className={cn("px-4 sm:px-6 lg:px-8 py-6 shrink-0", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Claim Board</h1>
          <p className="text-md text-mute mt-1">
            Drag conversations between columns to manage their status.
          </p>
        </div>
        <ClaimSearchBar value={searchTerm} onChange={onSearchChange} />
      </div>
    </div>
  )
}
