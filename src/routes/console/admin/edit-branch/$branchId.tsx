import { createFileRoute } from '@tanstack/react-router';
import { EditBranchPage } from '@/modules/console/pages/admin';

function RouteComponent() {
  return <EditBranchPage />;
}

export const Route = createFileRoute('/console/admin/edit-branch/$branchId')({
  component: RouteComponent,
});
