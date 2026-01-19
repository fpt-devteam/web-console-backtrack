import { StaffNotificationPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/notification')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffNotificationPage />
}
