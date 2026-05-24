import { InventoryPage } from '@/pages/console/staff/inventory.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory/')({
  component: InventoryPage,
})
