import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div></div>
}
