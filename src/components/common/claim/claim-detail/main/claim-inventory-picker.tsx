import { useMemo } from 'react'
import { Check, Clock, Package, Warehouse, X } from 'lucide-react'
import { useInventoryItems } from '@/hooks/use-inventory'
import { Skeleton } from '@/components/common/core/skeleton'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'
import { cn } from '@/lib/utils'
import type { InventoryListItem, ItemCategory } from '@/services/inventory.service'

interface ClaimInventoryPickerProps {
  orgId: string
  category: string
  subCategoryId: string
  subcategoryNameById?: Record<string, string>
  selectedId?: string | null
  onSelect: (item: InventoryListItem) => void
  /** Items already reviewed and marked as not-a-match — hidden from suggestions. */
  notMatchInventoryIds?: Array<string> | null
  /** Request marking an item as not-a-match (opens a confirm dialog). */
  onMarkNotMatch?: (inventoryId: string, itemName: string) => void
  /** Id currently being marked as not-a-match (shows a pending state on its row). */
  markingNotMatchId?: string | null
}

/** Selectable vertical list of in-storage items the staff can match a claim against. */
export function ClaimInventoryPicker({
  orgId,
  category,
  subCategoryId,
  subcategoryNameById,
  selectedId,
  onSelect,
  notMatchInventoryIds,
  onMarkNotMatch,
  markingNotMatchId,
}: ClaimInventoryPickerProps) {
  const { data, isLoading } = useInventoryItems(orgId, {
    category: category as ItemCategory,
    status: 'InStorage',
    pageSize: 50,
  })

  const notMatchSet = useMemo(() => new Set(notMatchInventoryIds ?? []), [notMatchInventoryIds])
  const items = (data?.items ?? []).filter(
    (item) => item.subcategoryId === subCategoryId && !notMatchSet.has(item.id),
  )

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-1 shrink-0">
        <Package className="w-3.5 h-3.5 text-mute shrink-0" />
        <span className="text-xs font-bold tracking-widest text-ink uppercase">Choose item to verify against</span>
        {!isLoading && (
          <span className="text-[10px] font-medium text-mute bg-gray-100 rounded-full px-2 py-0.5">{items.length}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <Package className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-ink">No matching items in storage</p>
            <p className="text-xs text-mute">There's nothing of this type to verify against right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <PickerRow
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item)}
                onMarkNotMatch={
                  onMarkNotMatch
                    ? () => onMarkNotMatch(item.id, getInventoryTitle(item, subcategoryNameById))
                    : undefined
                }
                isMarkingNotMatch={markingNotMatchId === item.id}
                subcategoryNameById={subcategoryNameById}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PickerRow({
  item,
  selected,
  onSelect,
  onMarkNotMatch,
  isMarkingNotMatch,
  subcategoryNameById,
}: {
  item: InventoryListItem
  selected: boolean
  onSelect: () => void
  onMarkNotMatch?: () => void
  isMarkingNotMatch?: boolean
  subcategoryNameById?: Record<string, string>
}) {
  const title = getInventoryTitle(item, subcategoryNameById)
  const subName = getInventorySubcategoryName(item, subcategoryNameById).trim()
  const storage = item.organizationStorageLocation?.trim() || '—'
  const foundTime = item.eventTime
    ? new Date(item.eventTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={selected}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border bg-white p-2.5 text-left transition-all hover:cursor-pointer hover:shadow-sm',
        selected ? 'border-rose-500 ring-2 ring-rose-200' : 'border-hairline hover:border-neutral-300',
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f7f7f7]">
        {item.imageUrls[0] ? (
          <img src={item.imageUrls[0]} alt={title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#c8c8c8]">
            <Package className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="truncate text-sm font-semibold text-ink">{title}</h4>
          {subName && (
            <span className="shrink-0 rounded-full border border-hairline bg-white px-2 py-0.5 text-[10px] font-medium text-mute">
              {subName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-mute">
          <span className="flex items-center gap-1 min-w-0">
            <Warehouse className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
            <span className="truncate">{storage}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3.5 w-3.5 text-neutral-300" />
            Found {foundTime}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {onMarkNotMatch && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMarkNotMatch()
            }}
            disabled={isMarkingNotMatch}
            title="Mark as not a match"
            className="flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs font-medium text-mute transition-colors hover:border-[#fdd] hover:bg-[#fff0f0] hover:text-danger disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            {isMarkingNotMatch ? 'Removing…' : 'Not a match'}
          </button>
        )}
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
            selected ? 'border-rose-500 bg-rose-500 text-white' : 'border-neutral-300 text-transparent group-hover:border-neutral-400',
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>
    </div>
  )
}
