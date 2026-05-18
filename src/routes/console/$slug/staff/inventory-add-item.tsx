import { AddItemPage } from '@/pages/console/staff/add-item'
import { createFileRoute } from '@tanstack/react-router'
import type { PostType } from '@/services/inventory.service'

export const Route = createFileRoute('/console/$slug/staff/inventory-add-item')({
  validateSearch: (): { type?: PostType } => ({
    type: 'Found',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <AddItemPage />
}
