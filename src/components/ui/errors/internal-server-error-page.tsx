import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Home, ServerCrash, RefreshCw } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function InternalServerError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="flex-col items-center gap-4">
          <ServerCrash className="h-16 w-16 text-danger" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              500 - Server Error
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Something went wrong on our end.
            </p>
          </div>
        </CardHeader>
        <CardBody className="items-center gap-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            We're working on fixing the issue. Please try again later.
          </p>
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<RefreshCw className="h-4 w-4" />}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button
              as={Link}
              to="/"
              variant="bordered"
              startContent={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
