import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
import { completeConsoleLogin, toFriendlyAuthErrorMessage } from '@/modules/auth/lib/complete-console-login';
import { Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useCheckEmail, useSignInWithGoogle } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { saveTempEmail, saveInvitationCode } from '@/lib/auth-storage';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Google “G” mark — only used by Continue with Google on this screen */
function ContinueWithGoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignInOrSignUp() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const checkEmail = useCheckEmail();
  const signInWithGoogle = useSignInWithGoogle();

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

  const handleGoogle = () => {
    signInWithGoogle.mutate(undefined, {
      onSuccess: async (user) => {
        saveTempEmail(user.email);
        const ok = await completeConsoleLogin(user);
        if (!ok) {
          showToast.error('Please verify your email before signing in. Check your inbox.');
        }
      },
      onError: (error) => {
        showToast.error(toFriendlyAuthErrorMessage((error as { message?: string })?.message));
      },
    });
  };

  const isBusy = checkEmail.isPending || signInWithGoogle.isPending;

  const inputCls =
    'h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111] placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:border-transparent transition-all duration-150';

  return (
    <ConsoleAuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <ConsoleAuthMobileLogo />
          <h2 className="text-2xl font-black tracking-tight text-[#111]">Sign in or sign up</h2>
          <p className="mt-1 text-[15px] font-medium text-[#888]">
            Use Google, or enter your work email. Existing accounts go to <span className="text-[#555]">Sign in</span>
            ; new operators go to <span className="text-[#555]">Sign up</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={isBusy}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#222] transition-all duration-150 hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Continue with Google"
        >
          {signInWithGoogle.isPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ccc] border-t-[#555]" />
          ) : (
            <ContinueWithGoogleIcon />
          )}
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-xs font-semibold tracking-widest text-[#aaa] uppercase">or</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
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
