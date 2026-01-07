import { createFileRoute } from '@tanstack/react-router';
import { FeaturesPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/features')({
  component: FeaturesPage,
});
