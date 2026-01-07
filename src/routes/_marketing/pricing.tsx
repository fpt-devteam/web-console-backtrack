import { createFileRoute } from '@tanstack/react-router';
import { PricingPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/pricing')({
  component: PricingPage,
});
