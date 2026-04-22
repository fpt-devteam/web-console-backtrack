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
    <div className={['border-b border-gray-200', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = value === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                'relative whitespace-nowrap py-1 text-sm font-medium transition-all',
                active ? 'text-blue-600' : 'text-black',
                'hover:scale-[1.03] hover:drop-shadow-sm',
              ].join(' ')}
            >
              {t === 'All' ? 'All' : inventoryStatusLabel(t)}
              <span
                className={[
                  'absolute left-0 right-0 -bottom-px h-0.5 transition-colors',
                  active ? 'bg-blue-600' : 'bg-transparent',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

