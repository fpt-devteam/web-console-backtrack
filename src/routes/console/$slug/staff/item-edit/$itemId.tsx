import { EditItemPage } from '@/modules/console/pages/staff/edit-item/index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/item-edit/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditItemPage />
}
