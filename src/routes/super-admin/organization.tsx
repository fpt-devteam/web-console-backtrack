import { OrganizationPage } from '@/modules/super-admin/pages/organization';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/organization')({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrganizationPage />;
}
