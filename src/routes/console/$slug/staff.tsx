import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireOrgStaff } from '@/lib/route-guards'
import { Forbidden } from '@/components/common/errors/forbidden-page'
import { StaffLayout } from '@/components/console/staff/staff-layout'

export const Route = createFileRoute('/console/$slug/staff')({
  beforeLoad: async ({ context }) => {
    await requireOrgStaff(context.queryClient)
  },
  errorComponent: Forbidden,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <StaffLayout>
      <Outlet />
    </StaffLayout>
  )
}

