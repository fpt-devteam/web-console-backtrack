import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/core/select'
import type { AssigneeFilter, ClaimBoardFilterState, SortOption } from './claim-board-filter.types'

interface ClaimBoardFilterProps {
  filter: ClaimBoardFilterState
  totalCount: number
  filteredCount: number
  onChange: (filter: ClaimBoardFilterState) => void
}

const ASSIGNEE_OPTIONS: { value: AssigneeFilter; label: string }[] = [
  { value: 'all',        label: 'All' },
  { value: 'mine',       label: 'Mine' },
  { value: 'unassigned', label: 'Unassigned' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-1 rounded-md text-sm font-bold transition-colors',
        active
          ? 'bg-white text-gray-900'
          : 'text-mute hover:text-ink hover:cursor-pointer',
      )}
    >
      {children}
    </button>
  )
}

export function ClaimBoardFilter({ filter, totalCount, filteredCount, onChange }: ClaimBoardFilterProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-8 lg:px-10 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-widest text-mute uppercase">Assignee</span>
          <div className="flex items-center bg-gray-200 p-1 rounded-md">
            {ASSIGNEE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                active={filter.assignee === opt.value}
                onClick={() => onChange({ ...filter, assignee: opt.value })}
              >
                {opt.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-mute">
          Showing <span className="font-medium text-ink">{filteredCount}</span> of{' '}
          <span className="font-medium">{totalCount}</span> claims
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">Sort by</span>
          <Select
            value={filter.sort}
            onValueChange={(value) => onChange({ ...filter, sort: value as SortOption })}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
