import type { StatusFilter } from './use-inventory-list-state'
import { inventoryStatusLabel } from './status'

const TABS: StatusFilter[] = [
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
}: {
  value: StatusFilter
  onChange: (v: StatusFilter) => void
  className?: string
}) {
  return (
    // Airbnb tab strip — Ink Black 2px underline for active, Hairline Gray rule
    <div className={['border-b border-[#dddddd]', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = value === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                'relative whitespace-nowrap py-3 text-sm font-medium transition-colors',
                active ? 'text-[#222222]' : 'text-[#6a6a6a] hover:text-[#222222]',
              ].join(' ')}
            >
              {t === 'All' ? 'All' : inventoryStatusLabel(t)}
              {/* 2px Ink Black underline — matches Airbnb's tab indicator */}
              <span
                className={[
                  'absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors',
                  active ? 'bg-[#222222]' : 'bg-transparent',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}


