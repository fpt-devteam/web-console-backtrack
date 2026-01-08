import { SignIn } from '@/modules/auth/components/signin';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignIn />;
}
