import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useCheckEmail } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { saveTempEmail } from '@/mock/storage/auth-storage';

export function SignInOrSignUp() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const checkEmail = useCheckEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast.error('Please enter your email address');
      return;
    }

    checkEmail.mutate(email, {
      onSuccess: (result) => {
        // Save email to sessionStorage (không hiển thị trên URL)
        saveTempEmail(result.email);
        
        if (result.exists) {
          // Email exists -> go to signin
          router.navigate({ to: '/auth/signin' });
        } else {
          // Email doesn't exist -> go to create password
          router.navigate({ to: '/auth/create-password' });
        }
      },
      onError: (error) => {
        showToast.error(error.message || 'An error occurred. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#E5F4FF] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold   text-center mb-2">
            Sign In or Sign Up
          </h1>

          {/* Instructions */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your email to access your account or create a new one.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm font-medium ">
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

            {/* Hint */}
            <p className="text-xs text-gray-500 text-start">
              We'll send you a magic link or password prompt.
            </p>

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-gray-800 text-white py-5 text-base font-medium"
              disabled={checkEmail.isPending}
            >
              {checkEmail.isPending ? 'Checking...' : 'Continue →'}
            </Button>

            {/* Security Info */}
            <p className="text-xs font-semibold text-gray-700 text-center mt-5">
              SECURED BY ENTERPRISE SSO
            </p>
          </form>

          {/* Legal Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Contact Support
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 text-center mt-6">
            © 2023 Enterprise Corp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

