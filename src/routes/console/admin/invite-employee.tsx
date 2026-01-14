import { InviteEmployeePage } from '@/modules/console/pages/admin/invite-employee';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/admin/invite-employee')({
  component: RouteComponent,
});

function RouteComponent() {
  return <InviteEmployeePage />;
}
