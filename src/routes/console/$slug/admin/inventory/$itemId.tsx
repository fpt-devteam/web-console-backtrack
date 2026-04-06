import { AdminInventoryItemDetailPage } from '@/modules/console/pages/admin/inventory-item-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/inventory/$itemId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminInventoryItemDetailPage />;
}
