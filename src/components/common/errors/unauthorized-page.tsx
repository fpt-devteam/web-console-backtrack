import { Home, Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white rounded-[14px] border border-[#dddddd] p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Lock className="h-16 w-16 text-[#c97a00]" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#222222]">
              401 - Unauthorized
            </h1>
            <p className="mt-2 text-base text-[#6a6a6a]">
              You need to be authenticated to access this page.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-[#6a6a6a]">
            Please log in to continue.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-[#ff385c] text-white text-sm font-medium hover:bg-[#e8324f] active:scale-[0.92] transition-all"
          >
            <Home className="h-4 w-4" />
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
