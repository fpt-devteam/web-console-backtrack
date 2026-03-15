import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/console/admin/setting/')({
  beforeLoad: () => {
    throw redirect({ to: '/console/admin/setting/organization' })
  },
  component: () => null,
})

