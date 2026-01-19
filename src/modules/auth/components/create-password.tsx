import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useSignUp } from '@/hooks/use-auth';
import { showToast } from '@/lib/toast';
import { saveTempEmail, getTempEmail } from '@/mock/storage/auth-storage';

export function CreatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const signUp = useSignUp();

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

    // Validate passwords match
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return;
    }

    signUp.mutate(
      { email, password },
      {
        onSuccess: () => {
          // Save email to temp storage for check-email page
          saveTempEmail(email);
          showToast.success('Account created successfully!');
          router.navigate({ to: '/auth/check-email' });
        },
        onError: (error) => {
          showToast.error(error.message || 'Failed to create account. Please try again.');
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
          <h1 className="text-2xl font-bold  text-center mb-2">
            Create a Password
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Set a password to secure your account.
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
                  readOnly
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium  mb-2 block">
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

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium  mb-2 block">
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium mt-6"
              disabled={signUp.isPending}
            >
              {signUp.isPending ? 'Creating Account...' : 'Continue'}
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
