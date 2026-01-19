import { AddFoundItemPage } from '@/modules/console/pages/staff/add-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/inventory-add-item')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddFoundItemPage />
}
