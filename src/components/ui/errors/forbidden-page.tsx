import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Home, ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Forbidden() {
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
              You do not have permission to access this page.
            </p>
          </div>
        </CardHeader>
        <CardBody className="items-center gap-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Access is denied. Please contact an administrator if you believe this is an error.
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
