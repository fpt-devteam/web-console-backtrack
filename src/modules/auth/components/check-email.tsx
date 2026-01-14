import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { getTempEmail, clearTempEmail } from '@/mock/storage/auth-storage';
import { showToast } from '@/lib/toast';

export function CheckEmail() {
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(2);
  const router = useRouter();

  useEffect(() => {
    // Get email from temp storage
    const tempEmail = getTempEmail();
    if (tempEmail) {
      setEmail(tempEmail);
    } else {
      // If no email, redirect back
      showToast.error('No email found. Please sign up again.');
      router.navigate({ to: '/auth/signin-or-signup' });
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleContinue = () => {
    // Clear temp email and start fresh
    clearTempEmail();
    showToast.success('Account created! Please sign in with your new account.');
    router.navigate({
      to: '/auth/signin-or-signup',
    });
  };

  // Mask email for privacy
  const maskEmail = (email: string): string => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }
    return `${name.substring(0, 2)}***@${domain}`;
  };

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
              {email ? maskEmail(email) : 'your email'}
            </span>
            . <br />
            Please follow the instructions in the email to activate your account
            and proceed.
          </p>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium"
          >
            Continue
          </Button>

          {/* Countdown */}
          <p className="text-xs text-gray-500 mt-3">
            Redirecting automatically in <span className="font-medium">{countdown}</span> second{countdown !== 1 ? 's' : ''}
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
