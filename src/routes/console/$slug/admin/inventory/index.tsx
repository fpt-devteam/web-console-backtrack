import { AdminInventoryMonitorPage } from '@/pages/console/admin/inventory-monitor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/$slug/admin/inventory/')({
  component: AdminInventoryMonitorPage,
});
