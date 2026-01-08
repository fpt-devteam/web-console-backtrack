
import { Loader2 } from 'lucide-react';

export function Redirect() {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#E5F4FF] rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        </div>

        <h1 className="text-xl font-semibold  mb-2">
          Redirecting you to your company&apos;s sign-in page…
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Establishing secure connection…
        </p>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-blue-500 animate-pulse" />
        </div>

        <p className="text-sm mt-6">
          <a href="#" className="text-blue-600 hover:underline">
            Click here if you are not redirected automatically
          </a>
        </p>

        <p className="text-xs text-gray-500 mt-6">
          Secured by Backtrack Identity
        </p>
      </div>
    </div>
  );
}
