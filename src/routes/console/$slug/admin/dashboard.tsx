import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboardPage } from '@/pages/console/admin/dashboard';

export const Route = createFileRoute('/console/$slug/admin/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminDashboardPage />;
}
