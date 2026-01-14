import { EditAccountPage } from '@/modules/console/pages/admin/edit-account';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/admin/edit-account')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditAccountPage />;
}
