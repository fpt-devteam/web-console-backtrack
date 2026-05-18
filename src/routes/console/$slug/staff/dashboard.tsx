import { createFileRoute } from '@tanstack/react-router'
import { StaffDashboardPage } from '@/pages/console/staff/dashboard'

export const Route = createFileRoute('/console/$slug/staff/dashboard')({
  component: StaffDashboardPage,
})
