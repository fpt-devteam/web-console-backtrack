import { UsersPage } from '@/modules/super-admin/pages/users';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const usersSearchSchema = z.object({
  userId: z.string().optional(),
});

export const Route = createFileRoute('/super-admin/users')({
  validateSearch: usersSearchSchema,
  component: UsersPage,
});
