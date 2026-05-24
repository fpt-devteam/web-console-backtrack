import { EditInventoryPage } from '@/pages/console/staff/inventory-edit.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory/$itemId/edit')({
  component: EditInventoryPage,
})
