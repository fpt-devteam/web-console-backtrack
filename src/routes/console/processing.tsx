import { ProcessingPage } from '@/modules/console/pages/processing';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  slug: z.string().optional(),
});

export const Route = createFileRoute('/console/processing')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useSearch();
  return <ProcessingPage slug={slug} />;
}
