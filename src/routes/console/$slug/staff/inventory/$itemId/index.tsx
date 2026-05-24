import { InventoryDetailPage } from '@/pages/console/staff/inventory-detail.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory/$itemId/')({
  component: InventoryDetailPage,
})
