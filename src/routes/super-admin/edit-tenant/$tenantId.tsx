import { EditTenantPage } from '@/modules/super-admin/pages/edit-tenant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/edit-tenant/$tenantId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditTenantPage />;
}
