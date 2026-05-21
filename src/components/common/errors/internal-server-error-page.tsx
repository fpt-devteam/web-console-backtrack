import { Home, ServerCrash, RefreshCw } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function InternalServerError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white rounded-[14px] border border-[#dddddd] p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <ServerCrash className="h-16 w-16 text-[#c13515]" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#222222]">
              500 - Server Error
            </h1>
            <p className="mt-2 text-base text-[#6a6a6a]">
              Something went wrong on our end.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-[#6a6a6a]">
            We're working on fixing the issue. Please try again later.
          </p>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-[#ff385c] text-white text-sm font-medium hover:bg-[#e8324f] active:scale-[0.92] transition-all"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-[#dddddd] text-[#222222] text-sm font-medium hover:bg-[#f7f7f7] active:scale-[0.92] transition-all"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
