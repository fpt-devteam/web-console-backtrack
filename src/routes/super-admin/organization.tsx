import { OrganizationPage } from '@/pages/super-admin/organization';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const organizationSearchSchema = z.object({
  tenantId: z.string().optional(),
});

export const Route = createFileRoute('/super-admin/organization')({
  validateSearch: organizationSearchSchema,
  component: OrganizationPage,
});
