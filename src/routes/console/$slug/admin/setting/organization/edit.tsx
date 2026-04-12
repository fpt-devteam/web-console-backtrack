import { createFileRoute } from '@tanstack/react-router'
import { SettingPage } from '@/modules/console/pages/admin/setting'

export const Route = createFileRoute('/console/$slug/admin/setting/organization/edit')({
  component: () => <SettingPage />,
})
