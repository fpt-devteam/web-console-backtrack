import { PlanPage } from '@/modules/console/pages/admin/plan';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/admin/plan')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PlanPage />;
}
