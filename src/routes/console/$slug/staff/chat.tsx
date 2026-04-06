import { StaffChatPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffChatPage />
}
