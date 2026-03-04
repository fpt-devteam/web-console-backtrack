import { createFileRoute } from '@tanstack/react-router'
import { SettingSecurityPage } from '@/modules/console/pages/admin/setting-security'

export const Route = createFileRoute('/console/admin/setting/security')({
  component: () => <SettingSecurityPage />,
})
