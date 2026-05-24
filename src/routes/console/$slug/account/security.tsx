import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/console/admin/admin-layout'
import { SecurityPage } from '@/pages/console/admin/security-page'

export const Route = createFileRoute('/console/$slug/account/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminLayout>
      <SecurityPage />
    </AdminLayout>
  )
}
