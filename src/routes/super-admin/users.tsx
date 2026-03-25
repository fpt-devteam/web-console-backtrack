import { UsersPage } from '@/modules/super-admin/pages/users';
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const isIndexRoute = location.pathname === '/super-admin/users';

  return (
    <>
      {isIndexRoute ? <UsersPage /> : null}
      <Outlet />
    </>
  );
}
