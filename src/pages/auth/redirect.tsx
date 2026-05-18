import { Loader2 } from 'lucide-react';

export function Redirect() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">
      <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 w-full max-w-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#ff385c] animate-spin" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-[#222222] mb-2">
          Redirecting you to your company&apos;s sign-in page…
        </h1>

        <p className="text-sm text-[#6a6a6a] mb-6">
          Establishing secure connection…
        </p>

        <div className="h-2 bg-[#dddddd] rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-[#ff385c] animate-pulse" />
        </div>

        <p className="text-sm mt-6">
          <a href="#" className="text-[#ff385c] hover:underline">
            Click here if you are not redirected automatically
          </a>
        </p>

        <p className="text-xs text-[#929292] mt-6">
          Secured by Backtrack Identity
        </p>
      </div>
    </div>
  );
}
