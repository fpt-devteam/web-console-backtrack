import { HandoverItemPage } from '@/modules/console/pages/staff/handover-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/item-handover/$itemId')({
  component: HandoverItemPage,
})

