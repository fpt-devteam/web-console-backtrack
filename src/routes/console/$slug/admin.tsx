import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireOrgAdmin } from '@/lib/route-guards'
import { Forbidden } from '@/components/ui/errors/forbidden-page'

export const Route = createFileRoute('/console/$slug/admin')({
  beforeLoad: async ({ context }) => {
    await requireOrgAdmin(context.queryClient)
  },
  errorComponent: Forbidden,
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

