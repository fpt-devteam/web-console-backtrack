import { createFileRoute } from '@tanstack/react-router';
import { ApplyPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/apply')({
  component: ApplyPage,
});
