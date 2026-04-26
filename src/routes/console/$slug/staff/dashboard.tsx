import { createFileRoute } from '@tanstack/react-router'
import { StaffDashboardPage } from '@/modules/console/pages/staff/dashboard'

export const Route = createFileRoute('/console/$slug/staff/dashboard')({
  component: StaffDashboardPage,
})
