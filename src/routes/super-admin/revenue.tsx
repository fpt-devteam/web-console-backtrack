import { RevenuePage } from '@/modules/super-admin/pages/revenue';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/revenue')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RevenuePage />;
}
