import { PricingPage } from '@/pages/console/admin/pricing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/pricing')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PricingPage />;
}
