import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/contact')({
  component: ContactPage,
});
