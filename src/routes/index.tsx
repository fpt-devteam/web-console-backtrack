import { createFileRoute } from '@tanstack/react-router';
import { MarketingLayout, HomePage } from '@/modules/marketing';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <MarketingLayout>
      <HomePage />
    </MarketingLayout>
  );
}
