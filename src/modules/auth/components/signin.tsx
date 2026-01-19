import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useSignIn } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { getTempEmail } from '@/mock/storage/auth-storage';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const signIn = useSignIn();

  // Get email from sessionStorage (không hiển thị trên URL)
  useEffect(() => {
    const tempEmail = getTempEmail();
    if (tempEmail) {
      setEmail(tempEmail);
    } else {
      // If no email provided, redirect back to signin-or-signup
      showToast.error('Please enter your email first');
      router.navigate({ to: '/auth/signin-or-signup' });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast.error('Please enter your password');
      return;
    }

    signIn.mutate(
      { email, password },
      {
        onSuccess: async () => {
          showToast.success('Welcome back!');
          // Small delay to ensure state is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          // Force navigation
          window.location.href = '/console/welcome';
        },
        onError: (error) => {
          showToast.error(error.message || 'Failed to sign in. Please try again.');
        },
      }
    );
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
            Sign In to Your Account
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Welcome back! Please enter your password.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium ">
                Email address
              </Label>
              <div className="relative mt-2 text-gray-600">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="pr-10"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-sm font-medium ">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
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
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={signIn.isPending}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium mt-6"
              disabled={signIn.isPending}
            >
              {signIn.isPending ? 'Signing In...' : 'Sign In'}
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
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
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


