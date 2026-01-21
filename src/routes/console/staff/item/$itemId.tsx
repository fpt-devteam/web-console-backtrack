import { ItemDetailPage } from '@/modules/console/pages/staff/item-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/item/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ItemDetailPage />
}
