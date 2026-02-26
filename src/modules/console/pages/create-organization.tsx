import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateOrganization } from '@/hooks/use-org';
import { useCurrentOrgId } from '@/contexts/current-org.context';

const INDUSTRY_OPTIONS = [
  { value: 'airport', label: 'Airport' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'university', label: 'University' },
  { value: 'mall', label: 'Shopping Mall' },
  { value: 'stadium', label: 'Stadium/Arena' },
  { value: 'transportation', label: 'Transportation Hub' },
  { value: 'other', label: 'Other' },
] as const;

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { setCurrentOrgId } = useCurrentOrgId();
  const createOrg = useCreateOrganization();
  const [form, setForm] = useState({
    name: '',
    industryType: '',
    address: '',
    slug: '',
    phone: '',
    taxIdentificationNumber: '',
  });
  const [error, setError] = useState<string | null>(null);

  const slugOk = form.slug.length > 3;

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createOrg.mutate(
      {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        address: form.address.trim() || undefined,
        phone: form.phone.trim(),
        industryType: form.industryType,
        taxIdentificationNumber: form.taxIdentificationNumber.trim(),
      },
      {
        onSuccess: (createdOrg) => {
          setCurrentOrgId(createdOrg.id);
          navigate({ to: '/console/processing' });
        },
        onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create organization'),
      }
    );
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
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-semibold mb-2 block">Company Name</Label>
                <Input
                  id="companyName"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Acme Inc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="industryType" className="text-sm font-semibold mb-2 block">Industry Type</Label>
                <select
                  id="industryType"
                  value={form.industryType}
                  onChange={update('industryType')}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="companyAddress" className="text-sm font-semibold mb-2 block">
                Company Address <span className="text-gray-400 font-normal">(Optional)</span>
              </Label>
              <Input
                id="companyAddress"
                value={form.address}
                onChange={update('address')}
                placeholder="1234 Main St, Suite 100"
              />
            </div>

            <div>
              <Label htmlFor="workspaceUrl" className="text-sm font-semibold mb-2 block">Workspace URL</Label>
              <div className="relative">
                <Input
                  id="workspaceUrl"
                  value={form.slug}
                  onChange={update('slug')}
                  placeholder="acme-corp"
                  className="w-full pr-32"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">.backtrack.com</span>
                </div>
                {slugOk && form.slug && (
                  <div className="absolute inset-y-0 right-36 flex items-center pr-2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">This will be your team's unique login URL.</p>
                {slugOk && form.slug && <p className="text-xs text-green-600 font-medium">Subdomain available</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="taxId" className="text-sm font-semibold mb-2 block">Tax Identification Number</Label>
                <Input
                  id="taxId"
                  value={form.taxIdentificationNumber}
                  onChange={update('taxIdentificationNumber')}
                  placeholder="XX-XXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <Button
              type="submit"
              disabled={createOrg.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base font-medium mt-6"
            >
              {createOrg.isPending ? 'Creating…' : 'Create Account'}
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

