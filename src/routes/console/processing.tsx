import { ProcessingPage } from '@/modules/console/pages/processing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/processing')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProcessingPage />;
}
