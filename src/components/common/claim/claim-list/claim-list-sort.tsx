import { ArrowDownUp, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/core/dropdown-menu'

export type ClaimSort = 'newest' | 'oldest'

const SORT_LABEL: Record<ClaimSort, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
}

const OPTIONS: Array<ClaimSort> = ['newest', 'oldest']

interface ClaimListSortProps {
  value: ClaimSort
  onChange: (value: ClaimSort) => void
}

export function ClaimListSort({ value, onChange }: ClaimListSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-neutral-50 hover:cursor-pointer"
        >
          <ArrowDownUp className="h-4 w-4 text-mute" />
          {SORT_LABEL[value]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className="flex cursor-pointer items-center justify-between"
          >
            {SORT_LABEL[option]}
            {value === option && <Check className="h-4 w-4 text-rose-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
