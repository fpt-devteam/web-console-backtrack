import { AddItemPage } from '@/modules/console/pages/staff/add-item'
import { createFileRoute } from '@tanstack/react-router'
import type { PostType } from '@/services/inventory.service'

export const Route = createFileRoute('/console/$slug/staff/inventory-add-item')({
  validateSearch: (search: Record<string, unknown>): { type?: PostType } => ({
    type: search.type === 'Lost' ? 'Lost' : 'Found',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <AddItemPage />
}
