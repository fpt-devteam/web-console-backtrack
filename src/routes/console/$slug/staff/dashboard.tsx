import { createFileRoute } from '@tanstack/react-router'
import { StaffDashboardPage } from '@/pages/console/staff/staff-dashboard.page'

export const Route = createFileRoute('/console/$slug/staff/dashboard')({
  component: StaffDashboardPage,
})
