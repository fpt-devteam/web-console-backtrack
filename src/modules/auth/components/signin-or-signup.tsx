import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
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
            Sign In or Sign Up
          </h1>

          <p className="text-sm text-[#6a6a6a] text-center mb-6">
            Enter your email to access your account or create a new one.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#222222]">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={checkEmail.isPending}
                required
              />
            </div>

            <p className="text-xs text-[#929292] text-start">
              We'll send you a magic link or password prompt.
            </p>

            <Button
              type="submit"
              className="w-full bg-[#ff385c] hover:bg-[#e0324f] text-white py-5 text-base font-medium"
              disabled={checkEmail.isPending}
            >
              {checkEmail.isPending ? 'Checking...' : 'Continue →'}
            </Button>

            <p className="text-xs font-semibold text-[#6a6a6a] text-center mt-5">
              SECURED BY ENTERPRISE SSO
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-[#ebebeb]">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#929292]">
              <a href="#" className="hover:text-[#222222] transition-colors">Terms of Service</a>
              <span className="text-[#dddddd]">•</span>
              <a href="#" className="hover:text-[#222222] transition-colors">Privacy Policy</a>
              <span className="text-[#dddddd]">•</span>
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
