import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Home, Search, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-50 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100 opacity-30 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto text-center">
        <Chip
          variant="bordered"
          startContent={<MapPin className="w-4 h-4" />}
          className="mb-6 border-2 border-blue-200 bg-white/80 backdrop-blur-sm"
        >
          Lost in Space
        </Chip>

        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        <Card className="mb-8 backdrop-blur-sm bg-white/90 border-2 shadow-2xl">
          <CardHeader className="flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              Oops! You're Lost
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              The page you're looking for seems to have wandered off.
              Don't worry, we'll help you find your way back!
            </p>
          </CardHeader>
          <CardBody className="items-center gap-6">
            <div className="py-8">
              <div className="relative mx-auto w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-gradient-to-tl from-purple-100 to-pink-100 rounded-full animate-pulse delay-300" />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-20 h-20 text-gray-300 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Button
                as={Link}
                to="/"
                color="primary"
                size="lg"
                className="w-full sm:w-auto"
                startContent={<Home className="h-5 w-5" />}
              >
                Go to Homepage
              </Button>

              <Button
                as={Link}
                to="/"
                variant="bordered"
                size="lg"
                className="w-full sm:w-auto"
                startContent={<ArrowLeft className="h-5 w-5" />}
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>

        <p className="text-sm text-gray-500 font-medium">
          Need help? Check if the URL is correct or try searching from the homepage.
        </p>
      </div>
    </div>
  );
}
