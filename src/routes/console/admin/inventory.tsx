import { Outlet, createFileRoute } from '@tanstack/react-router';

/**
 * Parent layout for /console/admin/inventory — child routes (index list, $itemId detail) render in Outlet.
 */
export const Route = createFileRoute('/console/admin/inventory')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
