import { cn } from '@/lib/utils'
import { ConversationStatus } from '@/types/chat.types'
import { STATUS_LABEL } from '../claim.constants'

/** Status filter for the claim list — any conversation status, or "all". */
export type ClaimStatusFilter = ConversationStatus | 'all'

export type ClaimStatusCounts = Record<ClaimStatusFilter, number>

const TABS: Array<{ key: ClaimStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: ConversationStatus.QUEUE, label: STATUS_LABEL[ConversationStatus.QUEUE] },
  { key: ConversationStatus.IN_PROGRESS, label: STATUS_LABEL[ConversationStatus.IN_PROGRESS] },
  { key: ConversationStatus.VERIFIED, label: STATUS_LABEL[ConversationStatus.VERIFIED] },
  { key: ConversationStatus.CLOSED, label: STATUS_LABEL[ConversationStatus.CLOSED] },
  { key: ConversationStatus.REJECTED, label: STATUS_LABEL[ConversationStatus.REJECTED] },
]

interface ClaimListTabsProps {
  active: ClaimStatusFilter
  counts: ClaimStatusCounts
  onChange: (filter: ClaimStatusFilter) => void
}

export function ClaimListTabs({ active, counts, onChange }: ClaimListTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium transition-colors hover:cursor-pointer',
              isActive ? 'bg-rose-50 text-rose-600' : 'text-mute hover:bg-neutral-100 hover:text-ink',
            )}
          >
            {tab.label}
            <span className={cn(
              'inline-flex min-w-4 items-center justify-center rounded-full px-1 text-xs font-semibold',
              isActive ? 'bg-rose-500 text-white' : 'bg-neutral-200 text-mute',
            )}>
              {counts[tab.key] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
