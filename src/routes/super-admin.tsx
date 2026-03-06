import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireSuperAdmin } from '@/lib/route-guards'
import { Forbidden } from '@/components/ui/errors/forbidden-page'

export const Route = createFileRoute('/super-admin')({
  beforeLoad: async ({ context }) => {
    await requireSuperAdmin(context.queryClient)
  },
  errorComponent: Forbidden,
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}

