import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState('');
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(false);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubdomain(value);
    // Simulate subdomain availability check (hardcoded for UI demo)
    setIsSubdomainAvailable(value.length > 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to processing page
    navigate({ to: '/console/processing' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Create Your Organization Account
            </h1>
            <p className="text-sm text-gray-600">
              Get started with Backtrack for your organization.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Company Name & Industry Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <Label htmlFor="companyName" className="text-sm font-semibold  mb-2 block">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Inc."
                  className="w-full"
                  required
                />
              </div>

              {/* Industry Type */}
              <div>
                <Label htmlFor="industryType" className="text-sm font-semibold  mb-2 block">
                  Industry Type
                </Label>
                <select
                  id="industryType"
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="airport">Airport</option>
                  <option value="hotel">Hotel</option>
                  <option value="university">University</option>
                  <option value="mall">Shopping Mall</option>
                  <option value="stadium">Stadium/Arena</option>
                  <option value="transportation">Transportation Hub</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Company Address */}
            <div>
              <Label htmlFor="companyAddress" className="text-sm font-semibold  mb-2 block">
                Company Address <span className="text-gray-400 font-normal">(Optional)</span>
              </Label>
              <Input
                id="companyAddress"
                type="text"
                placeholder="1234 Main St, Suite 100"
                className="w-full"
              />
            </div>

            {/* Workspace URL */}
            <div>
              <Label htmlFor="workspaceUrl" className="text-sm font-semibold  mb-2 block">
                Workspace URL
              </Label>
              <div className="relative">
                <Input
                  id="workspaceUrl"
                  type="text"
                  placeholder="acme-corp"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="w-full pr-32"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">.backtrack.com</span>
                </div>
                {isSubdomainAvailable && subdomain && (
                  <div className="absolute inset-y-0 right-36 flex items-center pr-2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  This will be your team's unique login URL.
                </p>
                {isSubdomainAvailable && subdomain && (
                  <p className="text-xs text-green-600 font-medium">
                    Subdomain available
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number & Tax ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-semibold  mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full"
                />
              </div>

              {/* Tax Identification Number */}
              <div>
                <Label htmlFor="taxId" className="text-sm font-semibold  mb-2 block">
                  Tax Identification Number
                </Label>
                <Input
                  id="taxId"
                  type="text"
                  placeholder="XX-XXXXXXX"
                  className="w-full"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm ">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base font-medium mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="transition-colors">
                Help Center
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

