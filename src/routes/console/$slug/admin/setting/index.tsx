import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/setting/')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/console/$slug/admin/setting/organization', params: { slug: params.slug } })
  },
  component: () => null,
})

