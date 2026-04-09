import { EmployeePage } from '@/modules/console/pages/admin/employee';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  tab: z.string().optional(),
  modal: z.string().optional(),
  membershipId: z.string().optional(),
});

export const Route = createFileRoute('/console/$slug/admin/employee')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <EmployeePage />;
}

