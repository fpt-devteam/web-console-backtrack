import { StaffChatPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/staff/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffChatPage />
}
