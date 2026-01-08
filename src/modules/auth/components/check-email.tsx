import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function CheckEmail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#E5F4FF] rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold  mb-2">
            Check your email
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            An activation link has been sent to{' '}
            <span className="font-medium text-black">
              user***@example.com
            </span>
            . <br />
            Please follow the instructions in the email to activate your account
            and proceed.
          </p>

          {/* Resend Button */}
          <Button
            variant="outline"
            className="w-full py-5 text-base font-medium flex items-center justify-center gap-2"
            disabled
          >
            <span className="inline-flex items-center gap-2">
              ⟳ Resend activation email
            </span>
          </Button>

          {/* Countdown */}
          <p className="text-xs text-gray-500 mt-3">
            Resend available in <span className="font-medium">00:59</span>
          </p>

          {/* Support */}
          <p className="text-sm text-gray-600 mt-8">
            Didn&apos;t receive the email?{' '}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2023 Enterprise Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
