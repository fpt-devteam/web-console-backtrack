import { CheckEmail } from '@/pages/auth/check-email'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/check-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CheckEmail />
}
