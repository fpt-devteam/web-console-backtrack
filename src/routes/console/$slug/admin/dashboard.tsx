import { AdminDashboardPage } from '@/modules/console/pages/admin/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminDashboardPage />;
}
