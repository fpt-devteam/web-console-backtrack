import { inventoryStatusLabel } from './status'
import type { StatusFilter } from './use-inventory-list-state'

const TABS: Array<StatusFilter> = [
  'All',
  'InStorage',
  'Returned',
  'Archived',
  'Expired',
]

export function InventoryStatusTabs({
  value,
  onChange,
  className,
  hideBorder: _hideBorder = false,
}: {
  value: StatusFilter
  onChange: (v: StatusFilter) => void
  className?: string
  hideBorder?: boolean
}) {
  return (
    <div className={['flex gap-2', className].filter(Boolean).join(' ')}>
      {TABS.map((t) => {
        const active = value === t
        const label = t === 'All' ? 'All' : inventoryStatusLabel(t)
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={[
              'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap active:scale-[0.97] sm:px-4 sm:py-2 sm:text-sm',
              active
                ? 'border-primary text-primary bg-white shadow-sm'
                : 'border-hairline text-ash bg-white hover:bg-neutral-50 hover:border-ink hover:text-ink transition-colors',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}


