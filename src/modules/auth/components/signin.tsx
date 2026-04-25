import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useSignIn } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { getTempEmail, getInvitationCode } from '@/lib/auth-storage';
import { authService } from '@/services';
import { userService } from '@/services/user.service';
import { UserGlobalRole } from '@/types/user.types';

function toFriendlySignInErrorMessage(message: unknown): string {
  const raw = typeof message === 'string' ? message.trim() : '';
  if (!raw) return 'Unable to sign in. Please try again.';

  const lower = raw.toLowerCase();

  if (lower.includes('firebase') || lower.includes('auth/') || lower.includes('stack') || lower.includes('exception')) {
    return 'Unable to sign in. Please check your email and password and try again.';
  }

  if (lower.includes('network') || lower.includes('timeout') || lower.includes('failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  return raw;
}

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
          if (!user.emailVerified) {
            await authService.signOut();
            setFormError('Please verify your email before signing in. Check your inbox.');
            return;
          }

          const upsertedProfile = await userService.upsertUser();
          showToast.success('Welcome back!');

          const invitationCode = getInvitationCode();

          if (upsertedProfile.globalRole === UserGlobalRole.SUPER_ADMIN) {
            window.location.href = '/super-admin/dashboard';
            return;
          }

          if (invitationCode) {
            window.location.href = '/console/join-invitation';
          } else {
            window.location.href = '/console/welcome';
          }
        },
        onError: (error) => {
          setFormError(toFriendlySignInErrorMessage((error as any)?.message));
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#ff385c]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#222222] text-center mb-2">
            Sign In to Your Account
          </h1>

          <p className="text-sm text-[#6a6a6a] text-center mb-6">
            Welcome back! Please enter your password.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#222222]">
                Email address
              </Label>
              <div className="relative mt-2 text-[#929292]">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="pr-10"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#929292]" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#222222]">
                  Password
                </Label>
                <a href="#" className="text-sm text-[#ff385c] hover:text-[#c13515] font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  disabled={signIn.isPending}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#929292] hover:text-[#6a6a6a]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formError && (
                <p className="mt-2 text-sm text-[#c13515]" role="alert" aria-live="polite">
                  {formError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff385c] hover:bg-[#e0324f] text-white py-5 text-base font-medium mt-6"
              disabled={signIn.isPending}
            >
              {signIn.isPending ? 'Signing In...' : 'Sign In'}
            </Button>

            <p className="text-xs font-semibold text-[#6a6a6a] text-center mt-5">
              SECURED BY ENTERPRISE SSO
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-[#ebebeb]">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#929292]">
              <a href="#" className="hover:text-[#222222] transition-colors">Terms of Service</a>
              <span className="text-[#dddddd]">|</span>
              <a href="#" className="hover:text-[#222222] transition-colors">Privacy Policy</a>
              <span className="text-[#dddddd]">|</span>
              <a href="#" className="hover:text-[#222222] transition-colors">Contact Support</a>
            </div>
          </div>

          <p className="text-xs text-[#929292] text-center mt-6">
            © 2023 Enterprise Corp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
