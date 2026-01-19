import { StaffFeedPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/feed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffFeedPage />
}
