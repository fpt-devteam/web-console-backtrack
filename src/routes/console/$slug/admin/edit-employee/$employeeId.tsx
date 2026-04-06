import { createFileRoute } from '@tanstack/react-router';
import { EditEmployeePage } from '@/modules/console/pages/admin';

function RouteComponent() {
  return <EditEmployeePage />;
}

export const Route = createFileRoute('/console/$slug/admin/edit-employee/$employeeId')({
  component: RouteComponent,
});

