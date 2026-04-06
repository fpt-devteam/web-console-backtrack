import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/setting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
