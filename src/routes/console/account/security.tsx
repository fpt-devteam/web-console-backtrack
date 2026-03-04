import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '@/modules/auth/components/change-password'

export const Route = createFileRoute('/console/account/security')({
  component: () => <ChangePasswordPage />,
})
