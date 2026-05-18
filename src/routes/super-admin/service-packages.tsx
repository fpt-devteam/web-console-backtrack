import { ServicePackagesPage } from '@/pages/super-admin/service-packages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/service-packages')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ServicePackagesPage />;
}
