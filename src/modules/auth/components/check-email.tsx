import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
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
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const msg = error && typeof error === 'object' && 'message' in error ? String((error as Error).message) : '';
      showToast.error(msg || 'Failed to send email.');
    } finally {
      setResending(false);
    }
  };

  const handleContinue = async () => {
    showToast.success('Please sign in with your verified account.');
    router.navigate({ to: '/auth/signin' });
  };

  const maskEmail = (value: string): string => {
    const [name, domain] = value.split('@');
    if (!domain) return value;
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <ConsoleAuthLayout>
      <div className="w-full text-left">
        <div className="mb-8">
          <ConsoleAuthMobileLogo />
          <h2 className="text-2xl font-black tracking-tight text-[#111]">Verify your inbox</h2>
          <p className="mt-1 text-[15px] font-medium text-[#888]">
            We emailed a verification link — open it before returning to sign in.
          </p>
        </div>

        <div className="mb-6 flex justify-center rounded-full lg:justify-start">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA]">
            <Mail className="h-7 w-7 text-brand-500" aria-hidden />
          </span>
        </div>

        <p className="text-[15px] leading-relaxed text-[#555]">
          Sent to{' '}
          <span className="font-semibold text-[#111]">{email ? maskEmail(email) : 'your email'}</span>. Confirm the link to
          activate operator access before you continue.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            type="button"
            onClick={handleContinue}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-bold text-white transition-all hover:bg-[#222] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
          >
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={!canResend || resending}
            onClick={handleResend}
            className="h-12 w-full cursor-pointer rounded-xl border-[#E5E7EB] bg-white text-sm font-semibold text-[#222] hover:bg-[#F9FAFB]"
          >
            {resending ? 'Sending…' : !canResend ? `Resend in ${countdown}s` : 'Resend verification email'}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-[#aaa]">
          Spam folder tip: check promotions or junk if nothing arrives within a minute.
        </p>

        <p className="mt-6 text-center text-[14px] text-[#888]">
          Wrong email?{' '}
          <Link
            to="/auth/signin-or-signup"
            className="cursor-pointer font-bold text-[#111] transition-colors hover:text-brand-600"
          >
            Start over
          </Link>
        </p>
      </div>
    </ConsoleAuthLayout>
  );
}
