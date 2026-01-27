import { UsersPage } from '@/modules/super-admin/pages/users';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersPage />;
}
