import { Home, Search, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
      <div className="w-full max-w-lg bg-white rounded-[14px] border border-[#dddddd] p-10 text-center">
        <h1 className="text-[8rem] font-black tracking-tighter text-[#ff385c] leading-none mb-4">
          404
        </h1>

        <div className="mb-8">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-[#f7f7f7] mb-6">
            <Search className="w-10 h-10 text-[#929292] animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-[#222222] mb-3">
            Oops! You're Lost
          </h2>
          <p className="text-[#6a6a6a] leading-relaxed max-w-sm mx-auto">
            The page you're looking for seems to have wandered off.
            Don't worry, we'll help you find your way back!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[20px] bg-[#ff385c] text-white text-sm font-medium hover:bg-[#e8324f] active:scale-[0.92] transition-all"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[20px] border border-[#dddddd] text-[#222222] text-sm font-medium hover:bg-[#f7f7f7] active:scale-[0.92] transition-all"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <p className="mt-6 text-sm text-[#929292]">
          Need help? Check if the URL is correct or try searching from the homepage.
        </p>
      </div>
    </div>
  );
}
