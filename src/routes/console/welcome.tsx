import { WelcomePage } from '@/modules/console/pages/welcome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/console/welcome')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WelcomePage />;
}
