import type { AssignedClaimTab } from './assigned-claim.types'

interface AssignedClaimTabsProps {
  active: AssignedClaimTab
  onChange: (tab: AssignedClaimTab) => void
  handlingCount: number
  resolvedCount: number
}

const TABS: { value: AssignedClaimTab; label: string }[] = [
  { value: 'handling', label: 'Handling' },
  { value: 'resolved', label: 'Resolved' },
]

export function AssignedClaimTabs({ active, onChange, handlingCount, resolvedCount }: AssignedClaimTabsProps) {
  const countFor = (tab: AssignedClaimTab) => (tab === 'handling' ? handlingCount : resolvedCount)

  return (
    <div className="flex gap-2">
      {TABS.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap active:scale-[0.97]',
              isActive
                ? 'border-primary text-primary bg-white shadow-sm'
                : 'border-hairline text-ash bg-white hover:bg-neutral-50 hover:border-ink hover:text-ink',
            ].join(' ')}
          >
            {label}
            <span
              className={[
                'text-xs font-semibold rounded-full px-2 py-0.5',
                isActive ? 'bg-[#fff0f2] text-primary' : 'bg-neutral-100 text-mute',
              ].join(' ')}
            >
              {countFor(value)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
