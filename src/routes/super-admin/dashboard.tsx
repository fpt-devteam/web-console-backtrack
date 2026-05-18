import { DashboardPage } from '@/pages/super-admin/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardPage />;
}
