import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/admin/setting/organization')({
  component: () => <Outlet />,
})
