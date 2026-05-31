import { Fragment } from 'react'
import { cn } from '@/lib/utils'

/** A selectable view of the inventory detail (e.g. Overview, Claims). */
export interface InventoryDetailMode {
  name: string
  /** Optional count shown as a badge next to the name (e.g. number of claim requests). */
  badge?: number
  active?: boolean
  onSelect: () => void
}

interface InventoryDetailModeTabsProps {
  modes: Array<InventoryDetailMode>
  className?: string
}

export function InventoryDetailModeTabs({ modes, className }: InventoryDetailModeTabsProps) {
  if (modes.length === 0) return null

  return (
    <div className={cn('flex items-center gap-3 text-md bg-white', className)}>
      {modes.map((mode, i) => (
        <Fragment key={mode.name}>
          {i > 0 && <span className="text-neutral-200">|</span>}
          <button
            type="button"
            onClick={mode.onSelect}
            className={cn(
              'flex items-center gap-1.5 pb-0.5 font-semibold transition-colors hover:cursor-pointer',
              mode.active
                ? 'border-b-2 border-rose-500 text-ink'
                : 'border-b-2 border-transparent text-mute hover:text-ink',
            )}
          >
            {mode.name}
            {mode.badge != null && mode.badge > 0 && (
              <span className={cn(
                'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                mode.active ? 'bg-rose-500 text-white' : 'bg-neutral-200 text-mute',
              )}>
                {mode.badge}
              </span>
            )}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
