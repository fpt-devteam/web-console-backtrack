import { EmployeePage } from '@/modules/console/pages/admin/employee';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/admin/employee')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmployeePage />;
}

