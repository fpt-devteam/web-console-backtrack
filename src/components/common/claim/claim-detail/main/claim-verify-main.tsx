import { Pencil, ScanSearch } from 'lucide-react'
import { Spinner } from '@/components/common/core/spinner'
import { getInventoryTitle } from '@/utils/inventory-view'
import type { SupportFormData } from '@/types/chat.types'
import type { InventoryItem, InventoryListItem } from '@/services/inventory.service'
import { ClaimItemCard } from './claim-item-card'
import { ClaimComparisonView } from './claim-comparison-view'
import { ClaimInventoryPicker } from './claim-inventory-picker'

interface ClaimVerifyMainProps {
  supportFormData: SupportFormData
  /** Inventory item linked to the claim (when supportFormData.postId is set). */
  linkedItem?: InventoryItem | null
  isLinkedLoading?: boolean
  orgId?: string | null
  subcategoryNameById?: Record<string, string>
  subcategoryCodeById?: Record<string, string>
  /** Item picked to verify against (no-link case) — controlled by the page. */
  selectedItem: InventoryListItem | null
  onSelectItem: (item: InventoryListItem | null) => void
  /** Open the linked inventory item's detail page. */
  onViewLinkedItem?: () => void
}

export function ClaimVerifyMain({
  supportFormData,
  linkedItem,
  isLinkedLoading,
  orgId,
  subcategoryNameById,
  subcategoryCodeById,
  selectedItem,
  onSelectItem,
  onViewLinkedItem,
}: ClaimVerifyMainProps) {
  const hasLinkedItem = !!supportFormData.postId

  return (
    <div className="space-y-4 h-full">
      {hasLinkedItem ? (
        isLinkedLoading ? (
          <div className="flex items-center justify-center rounded-xl bg-white p-10">
            <Spinner size="md" label="Loading matched item…" />
          </div>
        ) : linkedItem ? (
          <ClaimComparisonView
            claim={supportFormData}
            item={linkedItem}
            subcategoryNameById={subcategoryNameById}
            subcategoryCodeById={subcategoryCodeById}
            onViewItem={onViewLinkedItem}
          />
        ) : (
          <ClaimItemCard supportFormData={supportFormData} subcategoryCodeById={subcategoryCodeById} />
        )
      ) : selectedItem ? (
        <>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 mx-2">
            <div className="flex items-center gap-2 min-w-0">
              <ScanSearch className="h-4 w-4 shrink-0 text-rose-500" />
              <span className="text-sm text-ink min-w-0 truncate">
                Verifying against{' '}
                <span className="font-semibold">{getInventoryTitle(selectedItem, subcategoryNameById)}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectItem(null)}
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 hover:cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              Change
            </button>
          </div>
          <ClaimComparisonView
            claim={supportFormData}
            item={selectedItem}
            subcategoryNameById={subcategoryNameById}
            subcategoryCodeById={subcategoryCodeById}
          />
        </>
      ) : (
        <div className="flex h-full flex-col gap-2">
          <ClaimItemCard supportFormData={supportFormData} subcategoryCodeById={subcategoryCodeById} />
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-sm text-amber-800 mx-2">
            This claim isn't linked to a stored item. Pick the matching item below to compare and verify.
          </div>
          {orgId && (
            <div className="min-h-0 flex-1">
              <ClaimInventoryPicker
                orgId={orgId}
                category={supportFormData.category}
                subCategoryId={supportFormData.subCategoryId}
                subcategoryNameById={subcategoryNameById}
                selectedId={null}
                onSelect={onSelectItem}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
