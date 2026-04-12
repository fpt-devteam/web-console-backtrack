import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Home, ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';

const MESSAGES: Record<string, string> = {
  FORBIDDEN_ORG_ADMIN: 'You need OrgAdmin privileges to access this page.',
  FORBIDDEN_ORG_STAFF: 'You need OrgStaff membership to access this page.',
  FORBIDDEN_ORG_NOT_MEMBER: 'You are not a member of this organization.',
  FORBIDDEN_SUPER_ADMIN: 'Super-admin access is required.',
};

export function Forbidden({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? (MESSAGES[error.message] ?? 'You do not have permission to access this page.')
      : 'You do not have permission to access this page.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="flex-col items-center gap-4">
          <ShieldAlert className="h-16 w-16 text-danger" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              403 - Forbidden
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </CardHeader>
        <CardBody className="items-center gap-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Contact an administrator if you believe this is an error.
          </p>
          <Button
            as={Link}
            to="/"
            color="primary"
            startContent={<Home className="h-4 w-4" />}
          >
            Go to Homepage
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
