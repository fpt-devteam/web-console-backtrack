import { Redirect } from '@/pages/auth/redirect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/redirect')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Redirect />
}
