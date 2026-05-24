import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireOrgAdmin } from '@/lib/route-guards'
import { Forbidden } from '@/components/common/errors/forbidden-page'
import { AdminLayout } from '@/components/console/admin/admin-layout'

export const Route = createFileRoute('/console/$slug/admin')({
  beforeLoad: async ({ context }) => {
    await requireOrgAdmin(context.queryClient)
  },
  errorComponent: Forbidden,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

