import { StaffInventoryPage } from '@/pages/console/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffInventoryPage />
}
