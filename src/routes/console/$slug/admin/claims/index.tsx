import { AdminClaimsPage } from '@/pages/console/admin/admin-claims.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/claims/')({
  component: AdminClaimsPage,
})
