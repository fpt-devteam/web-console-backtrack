import { UserDetailPage } from '@/modules/super-admin/pages/user-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/super-admin/users/$userId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserDetailPage />;
}

