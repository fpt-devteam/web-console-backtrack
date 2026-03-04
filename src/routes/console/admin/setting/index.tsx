import { createFileRoute } from '@tanstack/react-router'
import { SettingsHubPage } from '@/modules/console/pages/admin/settings-hub'

export const Route = createFileRoute('/console/admin/setting/')({
  component: () => <SettingsHubPage />,
})

