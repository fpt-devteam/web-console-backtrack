import { Redirect } from '@/modules/auth/components/redirect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/redirect')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Redirect />
}
