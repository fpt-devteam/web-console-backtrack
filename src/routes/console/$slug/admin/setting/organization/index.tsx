import { createFileRoute } from '@tanstack/react-router'
import { OrganizationInfoViewPage } from '@/pages/console/admin/organization-info-view'

export const Route = createFileRoute('/console/$slug/admin/setting/organization/')({
  component: () => <OrganizationInfoViewPage />,
})
