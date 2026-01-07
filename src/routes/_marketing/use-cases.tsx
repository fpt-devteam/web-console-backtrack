import { createFileRoute } from '@tanstack/react-router';
import { UseCasesPage } from '@/modules/marketing';

export const Route = createFileRoute('/_marketing/use-cases')({
  component: UseCasesPage,
});
