import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/about')({
  component: AboutPage,
});
