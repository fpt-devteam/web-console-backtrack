import { StaffLayout } from '../../components/staff/layout'
import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useInventoryItem, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { HandoverItemModal } from '@/modules/console/components/staff/handover-item-modal'
import { useOrgReturnReports } from '@/hooks/use-return-report'
import { InventoryItemDetailView } from '../../components/inventory/inventory-item-detail-view'
import { useSubcategories } from '@/hooks/use-subcategories'
import { getInventoryTitle } from '@/utils/inventory-view'

export function ItemDetailPage() {
  const { slug, itemId } = useParams({ from: '/console/$slug/staff/item/$itemId' })
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [handoverOpen, setHandoverOpen] = useState(false)
  const deleteItem = useDeleteInventoryItem(currentOrgId)

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const orgIdForHandover = item?.organization?.id ?? currentOrgId
  const { data: returnReports } = useOrgReturnReports(orgIdForHandover, 1, 50)
  const { data: subcategories } = useSubcategories()
  const subcategoryNameById = (subcategories ?? []).reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name
    return acc
  }, {})
  const returnReportForPost =
    returnReports?.items?.find((r) => r.post?.id === item?.id) ?? null

  return (
    <StaffLayout>
      <InventoryItemDetailView
        slug={slug}
        itemId={itemId}
        backTo={{ to: '/console/$slug/staff/inventory', params: { slug } }}
        isLoading={isLoading}
        item={item}
        mainImageIndex={mainImageIndex}
        onMainImageIndexChange={setMainImageIndex}
        returnReportForPost={returnReportForPost}
        subcategoryNameById={subcategoryNameById}
        showAddThumbnailButton
        actions={
          item && item.status !== 'Returned' && item.status !== 'Archived' && item.status !== 'Expired' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white transition-all hover:scale-[1.03] hover:drop-shadow-sm"
                onClick={() => setHandoverOpen(true)}
              >
                Handover
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white transition-all hover:scale-[1.03] hover:drop-shadow-sm"
                onClick={() => navigate({ to: `/console/${slug}/staff/item-edit/${item.id}` })}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[#c13515] border-[#c13515] hover:bg-[#c13515] hover:text-white transition-all hover:scale-[1.03] hover:drop-shadow-sm"
                disabled={deleteItem.isPending}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this item? This cannot be undone.')) {
                    deleteItem.mutate(item.id, {
                      onSuccess: () => navigate({ to: `/console/${slug}/staff/inventory` }),
                      onError: (err) => alert(err instanceof Error ? err.message : 'Failed to delete item'),
                    })
                  }
                }}
              >
                {deleteItem.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          ) : null
        }
        extra={
          item ? (
            <HandoverItemModal
              open={handoverOpen}
              title={`Handover — ${getInventoryTitle(item, subcategoryNameById)}`}
              orgId={orgIdForHandover}
              postId={item.id}
              onClose={() => setHandoverOpen(false)}
            />
          ) : null
        }
      />
    </StaffLayout>
  )
}

