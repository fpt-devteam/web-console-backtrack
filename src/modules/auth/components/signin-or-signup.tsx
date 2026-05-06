import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
import { Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useCheckEmail, useGoogleSignIn } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { saveTempEmail, saveInvitationCode } from '@/lib/auth-storage';
import { completeConsoleLogin, toFriendlyAuthErrorMessage } from '@/modules/auth/lib/complete-console-login'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInOrSignUp() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const checkEmail = useCheckEmail();
  const googleSignIn = useGoogleSignIn()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const emailParam = params.get('email');

    if (code) {
      saveInvitationCode(code);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showToast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      showToast.error('Please enter a valid email address');
      return;
    }

    checkEmail.mutate(normalizedEmail, {
      onSuccess: (result) => {
        saveTempEmail(result.email);

        if (result.exists) {
          router.navigate({ to: '/auth/signin' });
        } else {
          router.navigate({ to: '/auth/create-password' });
        }
      },
      onError: (error) => {
        showToast.error(error.message || 'An error occurred. Please try again.');
      },
    });
  };

  const isBusy = checkEmail.isPending;
  const isGoogleBusy = googleSignIn.isPending

  const inputCls =
    'h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111] placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:border-transparent transition-all duration-150';

  return (
    <ConsoleAuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <ConsoleAuthMobileLogo />
          <h2 className="text-2xl font-black tracking-tight text-[#111]">Sign in or sign up</h2>
          <p className="mt-1 text-[15px] font-medium text-[#888]">
            Enter your work email. Existing accounts go to <span className="text-[#555]">Sign in</span>; new operators go to{' '}
            <span className="text-[#555]">Sign up</span>.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            disabled={isBusy || isGoogleBusy}
            onClick={() => {
              googleSignIn.mutate(undefined, {
                onSuccess: async (user) => {
                  const ok = await completeConsoleLogin(user)
                  if (!ok) {
                    showToast.error('Please verify your email before signing in. Check your inbox.')
                  }
                },
                onError: (error) => {
                  showToast.error(toFriendlyAuthErrorMessage(error?.message))
                },
              })
            }}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#111] transition-all duration-150 hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.4 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.6l.0-.0 6.3 5.2C36.7 39.1 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <div className="text-xs font-semibold text-[#999]">OR</div>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-[#555] uppercase">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className={`pl-11 ${inputCls}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBusy}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isBusy}
            className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-bold text-white transition-all duration-150 hover:bg-[#222] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkEmail.isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </ConsoleAuthLayout>
  );
}
