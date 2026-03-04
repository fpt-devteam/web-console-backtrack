import { createFileRoute } from '@tanstack/react-router'
import { OrganizationInfoViewPage } from '@/modules/console/pages/admin/organization-info-view'

export const Route = createFileRoute('/console/admin/setting/organization')({
  component: () => <OrganizationInfoViewPage />,
})
