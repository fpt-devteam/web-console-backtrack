import { OrganizationDetailPage } from '@/modules/super-admin/pages/organization-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/organization/$tenantId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrganizationDetailPage />;
}
