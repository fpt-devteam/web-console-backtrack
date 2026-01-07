import { Outlet, createFileRoute } from '@tanstack/react-router';
import { MarketingLayout } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayoutRoute,
});

function MarketingLayoutRoute() {
  return (
    <MarketingLayout>
      <Outlet />
    </MarketingLayout>
  );
}
