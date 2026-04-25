import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
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
          } catch (error: any) {
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
            Create a Password
          </h1>

          <p className="text-sm text-[#6a6a6a] text-center mb-6">
            Set a password to secure your account.
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
                  readOnly
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#929292]" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#222222] mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password (min 6 chars)"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={signUp.isPending}
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
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#222222] mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={signUp.isPending}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#929292] hover:text-[#6a6a6a]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff385c] hover:bg-[#e0324f] text-white py-5 text-base font-medium mt-6"
              disabled={signUp.isPending}
            >
              {signUp.isPending ? 'Creating Account...' : 'Continue'}
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
