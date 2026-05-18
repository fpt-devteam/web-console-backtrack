import { CreateOrganizationPage } from '@/pages/console/create-organization';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/create-organization')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateOrganizationPage />;
}
