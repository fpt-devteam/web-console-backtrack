import { PricingPage } from '@/modules/console/pages/admin/pricing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/pricing')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PricingPage />;
}
