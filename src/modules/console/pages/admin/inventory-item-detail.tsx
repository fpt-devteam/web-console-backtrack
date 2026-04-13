import { Layout } from '../../components/admin/layout'
import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrgReturnReports } from '@/hooks/use-return-report'
import { InventoryItemDetailView } from '../../components/inventory/inventory-item-detail-view'

export function AdminInventoryItemDetailPage() {
  const { slug, itemId } = useParams({ strict: false }) as { slug: string, itemId: string }
  const { currentOrgId } = useCurrentOrgId()
  const [mainImageIndex, setMainImageIndex] = useState(0)

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const orgIdForHandover = item?.organization?.id ?? currentOrgId
  const { data: returnReports } = useOrgReturnReports(orgIdForHandover, 1, 50)
  const returnReportForPost =
    returnReports?.items?.find((r) => r.post?.id === item?.id) ?? null

  return (
    <Layout>
      <InventoryItemDetailView
        slug={slug}
        itemId={itemId}
        backTo={{ to: '/console/$slug/admin/inventory', params: { slug } }}
        isLoading={isLoading}
        item={item}
        mainImageIndex={mainImageIndex}
        onMainImageIndexChange={setMainImageIndex}
        returnReportForPost={returnReportForPost}
      />
    </Layout>
  )
}
