import { useMemo } from 'react'
import type { ClaimPreviewDialogProps } from './claim-preview-dialog.types'
import { ClaimPreviewHeader } from './claim-preview-header'
import { ClaimPreviewItemSection } from './claim-preview-item-section'
import { ClaimPreviewComparisonSection } from './claim-preview-comparison-section'
import { ClaimPreviewCustomerSection } from './claim-preview-customer-section'
import { ClaimPreviewMessageSection } from './claim-preview-message-section'
import { ClaimPreviewFooter } from './claim-preview-footer'
import { Spinner } from '@/components/common/core/spinner'
import { useInventoryItem, useMatchingInventoryCount } from '@/hooks/use-inventory'
import { useSubcategories } from '@/hooks/use-subcategories'

export function ClaimPreviewDialog({ conv, onClose, onTakeIt, onOpenDetail }: ClaimPreviewDialogProps) {
  const staffProfile = conv.assignedStaff
  const statusKey = conv.status
  const staffName = staffProfile?.displayName ?? staffProfile?.email ?? null

  // Linked found item this claim is about (via supportFormData.postId), if any.
  const postId = conv.supportFormData.postId || null
  const { data: inventoryItem, isLoading: isInventoryLoading } = useInventoryItem(conv.orgId, postId)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of subcategories ?? []) map[s.id] = s.name
    return map
  }, [subcategories])

  // In-storage items of the same subcategory the staff could match this claim against.
  const matchCount = useMatchingInventoryCount(
    conv.orgId,
    conv.supportFormData.category,
    conv.supportFormData.subCategoryId,
    conv.supportFormData.notMatchInventoryIds,
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ClaimPreviewHeader claimId={conv.id} status={statusKey} onClose={onClose} />

        <div className="overflow-y-auto flex flex-col gap-4 py-4">
          {postId && isInventoryLoading ? (
            <div className="px-5 py-10 flex items-center justify-center">
              <Spinner size="md" label="Loading matched item…" />
            </div>
          ) : inventoryItem ? (
            // Linked to a found item → compact side-by-side comparison.
            <ClaimPreviewComparisonSection
              claim={conv.supportFormData}
              item={inventoryItem}
              subcategoryNameById={subcategoryNameById}
            />
          ) : (
            // No linked item → focus on the customer's claim.
            <ClaimPreviewItemSection
              supportFormData={conv.supportFormData}
              createdAt={conv.createdAt}
              matchCount={matchCount}
            />
          )}

          <ClaimPreviewCustomerSection
            partner={conv.partner}
            lastActivityAt={conv.lastMessageAt}
          />

          <ClaimPreviewMessageSection message={conv.lastMessageContent} />
        </div>

        <ClaimPreviewFooter
          staffName={staffName}
          staffAvatarUrl={staffProfile?.avatarUrl}
          onTakeIt={onTakeIt}
          onOpenDetail={onOpenDetail}
        />
      </div>
    </div>
  )
}
