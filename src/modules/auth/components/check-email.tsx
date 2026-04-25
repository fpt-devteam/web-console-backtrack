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

  const maskEmail = (email: string): string => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#ff385c]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#222222] mb-2">
            Check your email
          </h1>

          <p className="text-sm text-[#6a6a6a] mb-8">
            A verification link has been sent to{' '}
            <span className="font-medium text-[#222222]">
              {email ? maskEmail(email) : 'your email'}
            </span>
            . <br />
            <strong>Click the link in your email to verify your account before continuing.</strong>
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-[#ff385c] hover:bg-[#e0324f] text-white py-5 text-base font-medium"
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

          <div className="mt-6 p-4 bg-[#f7f7f7] rounded-[8px]">
            <p className="text-xs text-[#6a6a6a] text-center">
              <strong>Important:</strong> Verify your email first, then click "Continue to login" to sign in.
            </p>
          </div>

          <p className="text-sm text-[#6a6a6a] mt-6 text-center">
            Check your spam folder if you don&apos;t see the email.
          </p>
        </div>

        <p className="text-xs text-[#929292] text-center mt-6">
          © 2023 Enterprise Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
