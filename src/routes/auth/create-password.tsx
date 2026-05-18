import { createFileRoute } from '@tanstack/react-router';
import { CreatePassword } from '@/pages/auth/create-password';

export const Route = createFileRoute('/auth/create-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreatePassword />;
}
