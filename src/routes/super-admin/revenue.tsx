import { createFileRoute } from '@tanstack/react-router';
import { RevenuePage } from '@/pages/super-admin/revenue';

export const Route = createFileRoute('/super-admin/revenue')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RevenuePage />;
}
