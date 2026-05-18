import { WelcomePage } from '@/pages/console/welcome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/welcome')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomePage />;
}
