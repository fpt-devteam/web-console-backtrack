import { StaffInventoryPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffInventoryPage />
}
