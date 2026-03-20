import { OrganizationPage } from '@/modules/super-admin/pages/organization';
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/organization')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const isIndexRoute = location.pathname === '/super-admin/organization';

  return (
    <>
      {isIndexRoute ? <OrganizationPage /> : null}
      <Outlet />
    </>
  );
}
