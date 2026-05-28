import type { SupportFormData } from '@/types/chat.types'
import type { InventoryItem } from '@/services/inventory.service'
import { Spinner } from '@/components/common/core/spinner'
import { ClaimItemCard } from './claim-item-card'
import { ClaimComparisonView } from './claim-comparison-view'
import { ClaimSimilarInventory } from './claim-similar-inventory'

interface ClaimMainContentProps {
  supportFormData: SupportFormData
  inventoryItem?: InventoryItem | null
  isInventoryLoading?: boolean
  subcategoryNameById?: Record<string, string>
  subcategoryCodeById?: Record<string, string>
  orgId?: string | null
  slug?: string | null
  role?: 'staff' | 'admin'
  onPrintSlip?: () => void
}

export function ClaimMainContent({
  supportFormData,
  inventoryItem,
  isInventoryLoading,
  subcategoryNameById,
  subcategoryCodeById,
  orgId,
  slug,
  role = 'staff',
  onPrintSlip,
}: ClaimMainContentProps) {
  const hasLinkedItem = !!supportFormData.postId

  return (
    <>
      {hasLinkedItem && isInventoryLoading ? (
        <div className="bg-white rounded-xl border border-hairline p-10 flex items-center justify-center">
          <Spinner size="md" label="Loading matched item…" />
        </div>
      ) : inventoryItem ? (
        <ClaimComparisonView
          claim={supportFormData}
          item={inventoryItem}
          subcategoryNameById={subcategoryNameById}
          subcategoryCodeById={subcategoryCodeById}
          onPrintSlip={onPrintSlip}
        />
      ) : (
        <>
          <ClaimItemCard
            supportFormData={supportFormData}
            subcategoryCodeById={subcategoryCodeById}
            onPrintSlip={onPrintSlip}
          />
          {orgId && slug && (
            <ClaimSimilarInventory
              orgId={orgId}
              slug={slug}
              category={supportFormData.category}
              subCategoryId={supportFormData.subCategoryId}
              subcategoryNameById={subcategoryNameById}
              role={role}
            />
          )}
        </>
      )}
    </>
  )
}
