import { createFileRoute } from '@tanstack/react-router'
import { SettingPage } from '@/pages/console/admin/setting'

export const Route = createFileRoute('/console/$slug/admin/setting/organization/edit')({
  component: () => <SettingPage />,
})
