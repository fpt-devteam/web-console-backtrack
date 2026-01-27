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

/**
 * Service Package Management Page
 * 
 * Displays all available service packages (Basic, Pro, VIP) with
 * pricing, features, and management options.
 * 
 * Features:
 * - Pricing cards with monthly pricing
 * - Package status management
 * - Edit and configure package options
 * - Popular package highlighting (green background)
 */
export function ServicePackagesPage() {

  /**
   * Formats currency amount
   * 
   * @param amount - Amount to format
   * @returns Formatted currency string
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };


  /**
   * Gets status badge color
   * 
   * @param status - Package status
   * @returns CSS classes for status badge
   */
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  /**
   * Gets package color scheme based on popularity
   * Popular package gets blue background, others get gray
   * 
   * @param isPopular - Whether package is most popular
   * @returns Object with color classes
   */
  const getPackageColors = (isPopular: boolean) => {
    if (isPopular) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
      };
    }
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-600',
      button: 'bg-gray-500 hover:bg-gray-600 text-white',
    };
  };

  /**
   * Handles edit package action
   * 
   * @param packageId - ID of package to edit
   */
  const handleEditPackage = (packageId: string) => {
    // TODO: Navigate to edit package page
    console.log('Edit package:', packageId);
  };

  /**
   * Formats limit value for display
   * 
   * @param limit - Limit value
   * @returns Formatted limit string
   */
  const formatLimit = (limit?: string | number) => {
    if (!limit) return '';
    if (limit === 'Unlimited' || limit === -1) return 'Unlimited';
    return limit.toString();
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Service Packages</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Management</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-18">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Package Management</h1>
            <p className="text-gray-600">
              Manage subscription packages, pricing, and features for tenant organizations.
            </p>
          </div>
          <Button
            onClick={() => {
              // TODO: Navigate to add package page
              console.log('Add new package');
            }}
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
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  pkg.isPopular ? `${colors.border} scale-105` : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className={`${colors.bg} p-6 rounded-t-2xl border-b ${colors.border}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        pkg.status
                      )}`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(pkg.monthlyPrice)}
                      </span>
                      <span className="text-gray-600">/mo</span>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6 space-y-4">
                  {/* Limits */}
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
                    <div className="text-center">
                      <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Users</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {pkg.maxUsers === -1 ? 'Unlimited' : pkg.maxUsers}
                      </p>
                    </div>
                    <div className="text-center">
                      <HardDrive className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Storage</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {pkg.maxStorage}GB
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Support</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {pkg.supportLevel}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                    {pkg.features.map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              feature.included ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {feature.name}
                          </span>
                          {feature.included && feature.limit && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({formatLimit(feature.limit)})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 border-t border-gray-200">
                  <Button
                    onClick={() => handleEditPackage(pkg.id)}
                    className={`w-full flex items-center justify-center gap-2 mb-2 ${colors.button}`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Package
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: View package details
                      console.log('View package:', pkg.id);
                    }}
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

