import { AddInventoryPage } from '@/pages/console/staff/inventory-add.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory/add')({
  component: AddInventoryPage,
})
