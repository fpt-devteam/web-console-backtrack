import { AdminInventoryMonitorPage } from '@/modules/console/pages/admin/inventory-monitor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/inventory/')({
  component: AdminInventoryMonitorPage,
});
