import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
import { completeConsoleLogin, toFriendlyAuthErrorMessage } from '@/modules/auth/lib/complete-console-login';
import { Lock, Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useSignIn } from '@/hooks/use-auth';
import { clearTempEmail, getTempEmail } from '@/lib/auth-storage';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const signIn = useSignIn();

  useEffect(() => {
    const tempEmail = getTempEmail();
    if (tempEmail) {
      setEmail(tempEmail);
    } else {
      setFormError('Please enter your email first');
      router.navigate({ to: '/auth/signin-or-signup' });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter your password');
      return;
    }

    signIn.mutate(
      { email, password },
      {
        onSuccess: async (user) => {
          const ok = await completeConsoleLogin(user);
          if (!ok) {
            setFormError('Please verify your email before signing in. Check your inbox.');
          }
        },
        onError: (error) => {
          setFormError(toFriendlyAuthErrorMessage((error as { message?: string })?.message));
        },
      }
    );
  };

  const isPending = signIn.isPending;
  const inputCls =
    'h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111] placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:border-transparent transition-all duration-150';

  return (
    <ConsoleAuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <ConsoleAuthMobileLogo />
          <h2 className="text-2xl font-black tracking-tight text-[#111]">Welcome back</h2>
          <p className="mt-1 text-[15px] font-medium text-[#888]">Sign in to your organisation console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-[#555] uppercase">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                autoComplete="email"
                className={`pl-11 ${inputCls}`}
              />
            </div>
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-[#888] transition-colors hover:text-brand-600"
              onClick={() => {
                clearTempEmail();
                router.navigate({ to: '/auth/signin-or-signup' });
              }}
            >
              Use a different email
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold tracking-widest text-[#555] uppercase">
                Password
              </Label>
              <button
                type="button"
                className="cursor-pointer text-xs font-semibold text-brand-500 transition-colors hover:text-brand-600"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                disabled={isPending}
                autoComplete="current-password"
                required
                className={`pl-11 pr-12 ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#bbb] transition-colors duration-150 hover:text-[#555]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {formError ? (
              <p className="text-sm text-[#c13515]" role="alert" aria-live="polite">
                {formError}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-bold text-white transition-all duration-150 hover:bg-[#222] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-[14px] text-[#888]">
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/signin-or-signup"
            className="cursor-pointer font-bold text-[#111] transition-colors hover:text-brand-600"
          >
            Sign up
          </Link>
        </p>
      </div>
    </ConsoleAuthLayout>
  );
}
