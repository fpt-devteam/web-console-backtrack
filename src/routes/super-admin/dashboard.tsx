import { DashboardPage } from '@/modules/super-admin/pages/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardPage />;
}
