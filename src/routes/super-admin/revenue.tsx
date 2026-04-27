import { createFileRoute } from '@tanstack/react-router';
import { RevenuePage } from '@/modules/super-admin/pages/revenue';

export const Route = createFileRoute('/super-admin/revenue')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RevenuePage />;
}
