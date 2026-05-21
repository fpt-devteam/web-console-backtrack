import { StaffMyClaimPage } from '@/pages/console/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/my-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffMyClaimPage />
}
