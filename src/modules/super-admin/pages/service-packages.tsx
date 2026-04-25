import { Layout } from '../components/layout';
import {
  Package,
  Edit,
  Check,
  X,
  Star,
  Users,
  HardDrive,
  Shield,
} from 'lucide-react';
import { mockServicePackages } from '@/mock/data/mock-service-packages';
import { Button } from '@/components/ui/button';

export function ServicePackagesPage() {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#e8f9f0] text-[#06c167] border-[#06c167]/20';
      case 'Inactive':
        return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
      case 'Draft':
        return 'bg-[#fff8e6] text-[#c97a00] border-[#c97a00]/20';
      default:
        return 'bg-[#f7f7f7] text-[#6a6a6a] border-[#dddddd]';
    }
  };

  const getPackageColors = (isPopular: boolean) => {
    if (isPopular) {
      return {
        bg: 'bg-[#fff0f2]',
        border: 'border-[#ff385c]/30',
        text: 'text-[#ff385c]',
        button: 'bg-[#ff385c] hover:bg-[#e8324f] text-white',
      };
    }
    return {
      bg: 'bg-[#f7f7f7]',
      border: 'border-[#dddddd]',
      text: 'text-[#6a6a6a]',
      button: 'bg-[#222222] hover:bg-[#333333] text-white',
    };
  };

  const handleEditPackage = (packageId: string) => {
    console.log('Edit package:', packageId);
  };

  const formatLimit = (limit?: string | number) => {
    if (!limit) return '';
    if (limit === 'Unlimited' || limit === -1) return 'Unlimited';
    return limit.toString();
  };

  return (
    <Layout>
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-[#6a6a6a]">
            <span className="hover:text-[#222222] cursor-pointer">Service Packages</span>
            <span className="mx-2">/</span>
            <span className="text-[#222222] font-medium">Management</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-18">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] mb-2">Service Package Management</h1>
            <p className="text-[#6a6a6a]">
              Manage subscription packages, pricing, and features for tenant organizations.
            </p>
          </div>
          <Button
            onClick={() => console.log('Add new package')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Add Package
          </Button>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mockServicePackages.map((pkg) => {
            const colors = getPackageColors(pkg.isPopular || false);

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-[14px] border-2 transition-all ${
                  pkg.isPopular ? `${colors.border} scale-105` : 'border-[#dddddd]'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-[#ff385c] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className={`${colors.bg} p-6 rounded-t-[14px] border-b ${colors.border}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#222222] mb-1">{pkg.name}</h3>
                      <p className="text-sm text-[#6a6a6a]">{pkg.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(pkg.status)}`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#222222]">
                        {formatCurrency(pkg.monthlyPrice)}
                      </span>
                      <span className="text-[#6a6a6a]">/mo</span>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6 space-y-4">
                  {/* Limits */}
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#ebebeb]">
                    <div className="text-center">
                      <Users className="w-5 h-5 text-[#929292] mx-auto mb-1" />
                      <p className="text-xs text-[#929292]">Users</p>
                      <p className="text-sm font-semibold text-[#222222]">
                        {pkg.maxUsers === -1 ? 'Unlimited' : pkg.maxUsers}
                      </p>
                    </div>
                    <div className="text-center">
                      <HardDrive className="w-5 h-5 text-[#929292] mx-auto mb-1" />
                      <p className="text-xs text-[#929292]">Storage</p>
                      <p className="text-sm font-semibold text-[#222222]">
                        {pkg.maxStorage}GB
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-5 h-5 text-[#929292] mx-auto mb-1" />
                      <p className="text-xs text-[#929292]">Support</p>
                      <p className="text-sm font-semibold text-[#222222]">
                        {pkg.supportLevel}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#222222] mb-3">Features</h4>
                    {pkg.features.map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#e8f9f0] flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-[#06c167]" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f7f7f7] flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-[#929292]" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              feature.included ? 'text-[#222222]' : 'text-[#929292]'
                            }`}
                          >
                            {feature.name}
                          </span>
                          {feature.included && feature.limit && (
                            <span className="text-xs text-[#929292] ml-2">
                              ({formatLimit(feature.limit)})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 border-t border-[#ebebeb]">
                  <Button
                    onClick={() => handleEditPackage(pkg.id)}
                    className={`w-full flex items-center justify-center gap-2 mb-2 ${colors.button}`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Package
                  </Button>
                  <Button
                    onClick={() => console.log('View package:', pkg.id)}
                    variant="ghost"
                    className="w-full text-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
