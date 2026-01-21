import { EditItemPage } from '@/modules/console/pages/staff/edit-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/item-edit/$itemId')({
  component: EditItemPage,
})
