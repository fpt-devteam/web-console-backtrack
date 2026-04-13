import { StaffLayout } from '../../components/staff/layout'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useInventoryItem, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { HandoverItemModal } from '@/modules/console/components/staff/handover-item-modal'
import { useOrgReturnReports } from '@/hooks/use-return-report'
import { InventoryItemDetailView } from '../../components/inventory/inventory-item-detail-view'

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
        showAddThumbnailButton
        actions={
          item && item.status !== 'Returned' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
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
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                {deleteItem.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Link to="/console/$slug/staff/item-edit/$itemId" params={{ slug, itemId: item.id }}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Edit
                </Button>
              </Link>
              <Button size="sm" type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setHandoverOpen(true)}>
                Handover
              </Button>
            </>
          ) : null
        }
        extra={
          item ? (
            <HandoverItemModal
              open={handoverOpen}
              title={`Handover — ${item.item.itemName}`}
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

