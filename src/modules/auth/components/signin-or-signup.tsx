import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConsoleAuthLayout, ConsoleAuthMobileLogo } from '@/modules/auth/components/console-auth-layout';
import { Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useCheckEmail } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { saveTempEmail, saveInvitationCode } from '@/lib/auth-storage';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInOrSignUp() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const checkEmail = useCheckEmail();

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
