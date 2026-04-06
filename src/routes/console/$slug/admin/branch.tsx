import { createFileRoute } from '@tanstack/react-router';
import { BranchPage } from '@/modules/console/pages/admin';

function RouteComponent() {
  return <BranchPage />;
}

export const Route = createFileRoute('/console/$slug/admin/branch')({
  component: RouteComponent,
});
