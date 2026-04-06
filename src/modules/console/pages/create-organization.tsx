import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateOrganization } from '@/hooks/use-org';
import { PlaceSearchInput } from '@/components/place-search-input';

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
  const createOrg = useCreateOrganization();
  const [form, setForm] = useState({
    name: '',
    industryType: '',
    address: '',
    slug: '',
    phone: '',
    contactEmail: '',
    taxIdentificationNumber: '',
  });
  const [logoUrl, setLogoUrl] = useState<string>('');
  /** Lat/lon from Nominatim when user selects a place; null if only typing. */
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  /** place_id from Nominatim (externalPlaceId for BE) when selected from dropdown. */
  const [externalPlaceId, setExternalPlaceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slugOk = form.slug.length > 3;

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Logo must be an image file');
      return;
    }

    setError(null);

    try {
      const loadImage = (f: File) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const url = URL.createObjectURL(f);
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
          };
          img.src = url;
        });

      const compressToDataUrl = (img: HTMLImageElement, maxDim: number, mime: string, quality: number) => {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const largest = Math.max(w, h);
        const scale = Math.min(1, maxDim / largest);

        const outW = Math.max(1, Math.round(w * scale));
        const outH = Math.max(1, Math.round(h * scale));

        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0, outW, outH);

        return canvas.toDataURL(mime, quality);
      };

      const img = await loadImage(file);

      // BE giới hạn `LogoUrl` max 2048 chars => cần resize/encode để string không vượt limit.
      const BE_LOGO_MAX_CHARS = 2048;
      const mimeTypes = ['image/webp', 'image/jpeg', 'image/png'];

      let best = '';
      for (const mime of mimeTypes) {
        let maxDim = 256;
        let quality = 0.72;
        for (let i = 0; i < 6; i++) {
          const dataUrl = compressToDataUrl(img, maxDim, mime, quality);
          best = dataUrl;
          if (dataUrl.length <= BE_LOGO_MAX_CHARS) break;
          maxDim = Math.max(32, Math.floor(maxDim * 0.85));
          quality = Math.max(0.25, quality * 0.8);
        }
        if (best.length <= BE_LOGO_MAX_CHARS) break;
      }

      if (!best || best.length > BE_LOGO_MAX_CHARS) {
        setError('Logo is too large. Please upload a smaller image.');
        return;
      }

      setLogoUrl(best);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process logo image');
      return;
    } finally {
      // Reset input so the same file can be re-selected if user wants.
      e.target.value = '';
    }
  };

  const removeLogo = () => {
    setLogoUrl('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!logoUrl) {
      setError('Organization logo is required');
      return;
    }
    const displayAddress = form.address.trim() || form.name.trim() || '—';
    const coords = location ?? { latitude: 0, longitude: 0 };
    createOrg.mutate(
      {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        displayAddress,
        location: coords,
        externalPlaceId: externalPlaceId ?? undefined,
        phone: form.phone.trim(),
        contactEmail: form.contactEmail.trim() || undefined,
        industryType: form.industryType,
        taxIdentificationNumber: form.taxIdentificationNumber.trim(),
        // BE expects `LogoUrl` string (we send base64 data URL from FE).
        logoUrl,
        // Default: phone is always required. Admin can change this in Security settings.
        requiredFinderContractFields: ['Phone'] as const,
        requiredOwnerContractFields: ['Phone'] as const,
      },
      {
        onSuccess: (createdOrg) => {
          navigate({ to: `/console/processing`, search: { slug: createdOrg.slug } });
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
            {/* Logo — layout aligned with staff Add Found Item → Photos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold text-gray-900">
                  Organization logo <span className="text-red-500">*</span>
                </Label>
                <span className="text-sm text-gray-500">1 image</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {logoUrl ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
                    <img
                      src={logoUrl}
                      alt="Organization logo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                {!logoUrl ? (
                  <label
                    className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      createOrg.isPending
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      id="orgLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={createOrg.isPending}
                    />
                    <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-2">Add logo</span>
                  </label>
                ) : (
                  <label
                    className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      createOrg.isPending
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={createOrg.isPending}
                    />
                    <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-2">Change</span>
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-semibold mb-2 block">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Acme Inc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="industryType" className="text-sm font-semibold mb-2 block">Industry Type <span className="text-red-500">*</span></Label>
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
                Company Address <span className="text-red-500">*</span>
              </Label>
              <PlaceSearchInput
                id="companyAddress"
                value={form.address}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, address: value }));
                  setError(null);
                }}
                onSelect={(place) => {
                  setForm((prev) => ({ ...prev, address: place.displayAddress }));
                  setLocation({ latitude: place.latitude, longitude: place.longitude });
                  setExternalPlaceId(place.placeId ?? null);
                }}
                placeholder="Type address or place name, then select a result for coordinates (OpenStreetMap)"
              />
              {location && (
                <p className="text-xs text-green-600 mt-1">
                  Selected coordinates: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="workspaceUrl" className="text-sm font-semibold mb-2 block">Workspace URL <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="phoneNumber" className="text-sm font-semibold mb-2 block">Phone Number <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="contactEmail" className="text-sm font-semibold mb-2 block">
                  Contact email <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  autoComplete="email"
                  value={form.contactEmail}
                  onChange={update('contactEmail')}
                  placeholder="support@company.com"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="taxId" className="text-sm font-semibold mb-2 block">Tax Identification Number <span className="text-red-500">*</span></Label>
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

