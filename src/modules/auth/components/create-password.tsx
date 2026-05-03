import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useSignUp } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { getTempEmail, saveTempEmail } from '@/lib/auth-storage';
import { authService } from '@/services';

export function CreatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();
  const signUp = useSignUp();

  useEffect(() => {
    const tempEmail = getTempEmail();
    if (tempEmail) {
      setEmail(tempEmail);
    } else {
      showToast.error('Please enter your email first');
      router.navigate({ to: '/auth/signin-or-signup' });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return;
    }

    signUp.mutate(
      { email, password },
      {
        onSuccess: async () => {
          try {
            await authService.sendVerificationEmail();
            saveTempEmail(email);
            showToast.success('Account created! Check your email to verify.');
            router.navigate({ to: '/auth/check-email' });
          } catch (_err: unknown) {
            saveTempEmail(email);
            showToast.error('Account created but failed to send verification email.');
            router.navigate({ to: '/auth/check-email' });
          }
        },
        onError: (error) => {
          showToast.error(error.message || 'Failed to create account.');
        },
      }
    );
  };

  const inputCls =
    'h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111] placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:border-transparent transition-all duration-150';

  return (
    <ConsoleAuthLayout>
      <div className="w-full">
        <div className="mb-8">
          <ConsoleAuthMobileLogo />
          <h2 className="text-2xl font-black tracking-tight text-[#111]">Sign up</h2>
          <p className="mt-1 text-[15px] font-medium text-[#888]">
            Create a password for your organisation console operator account. We&apos;ll email you to verify next.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-[#555] uppercase">
              Email
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                autoComplete="email"
                className={`pl-11 ${inputCls}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold tracking-widest text-[#555] uppercase">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className={`pl-11 pr-12 ${inputCls}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={signUp.isPending}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#bbb] transition-colors hover:text-[#555]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-bold tracking-widest text-[#555] uppercase">
              Confirm password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`pl-11 pr-12 ${inputCls}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={signUp.isPending}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#bbb] transition-colors hover:text-[#555]"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={signUp.isPending}
            className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111] text-sm font-bold text-white transition-all duration-150 hover:bg-[#222] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signUp.isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Sign up
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#888]">
          Already have an account?{' '}
          <Link
            to="/auth/signin-or-signup"
            className="cursor-pointer font-bold text-[#111] transition-colors hover:text-brand-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </ConsoleAuthLayout>
  );
}
