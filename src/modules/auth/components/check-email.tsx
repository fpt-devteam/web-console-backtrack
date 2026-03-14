import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { getTempEmail } from '@/lib/auth-storage';
import { showToast } from '@/lib/toast';
import { authService } from '@/services';

export function CheckEmail() {
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const tempEmail = getTempEmail();
    if (tempEmail) {
      setEmail(tempEmail);
    } else {
      showToast.error('No email found. Please sign up again.');
      router.navigate({ to: '/auth/signin-or-signup' });
    }
  }, [router]);

  const handleResend = async () => {
    if (!canResend) {
      showToast.error(`Please wait ${countdown} seconds before resending.`);
      return;
    }

    setResending(true);
    try {
      await authService.sendVerificationEmail();
      showToast.success('Verification email sent!');
      
      // Set cooldown 60 seconds
      setCanResend(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      showToast.error(error.message || 'Failed to send email.');
    } finally {
      setResending(false);
    }
  };

  const handleContinue = async () => {
    showToast.success('Please sign in with your verified account.');
    router.navigate({ to: '/auth/signin' });
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
          <p className="text-sm text-gray-600 mb-8">
            A verification link has been sent to{' '}
            <span className="font-medium text-black">
              {email ? maskEmail(email) : 'your email'}
            </span>
            . <br />
            <strong>Click the link in your email to verify your account before continuing.</strong>
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium"
            >
              Continue to login →
            </Button>

            <Button
              onClick={handleResend}
              disabled={!canResend || resending}
              variant="outline"
              className="w-full py-5 text-base font-medium"
            >
              {resending ? 'Sending...' : 
               !canResend ? `Resend in ${countdown}s` : 
               'Resend verification email'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Important:</strong> Verify your email first, then click "Continue to login" to sign in.
            </p>
          </div>

          {/* Support */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Check your spam folder if you don&apos;t see the email.
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
