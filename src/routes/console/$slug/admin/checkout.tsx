import { CheckoutPage } from '@/pages/console/admin/checkout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/checkout')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CheckoutPage />;
}
