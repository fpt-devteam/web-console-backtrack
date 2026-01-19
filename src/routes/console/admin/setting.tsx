import { SettingPage } from '@/modules/console/pages/admin/setting'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/admin/setting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingPage />
}
