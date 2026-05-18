import { ItemDetailPage } from '@/pages/console/staff/item-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/item/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ItemDetailPage />
}
