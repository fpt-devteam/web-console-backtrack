import { AddTenantPage } from '@/modules/super-admin/pages/add-tenant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/add-tenant')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddTenantPage />;
}
