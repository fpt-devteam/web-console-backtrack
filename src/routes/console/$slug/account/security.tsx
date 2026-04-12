import { createFileRoute } from '@tanstack/react-router'
import { SecurityPage } from '@/modules/console/pages/admin/security-page'

export const Route = createFileRoute('/console/$slug/account/security')({
  component: () => <SecurityPage />,
})
