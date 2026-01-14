import { Layout } from '../../components/admin/layout';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from '@tanstack/react-router';
import { 
  CreditCard, 
  Building2, 
  MapPin, 
  ArrowLeft,
  Save,
} from 'lucide-react';
import {
  mockAccountDetails,
  mockBillingAddress,
  mockPaymentMethod,
} from '@/mock/data';
import { showToast } from '@/lib/toast';
import {
  getAccountDetails,
  getBillingAddress,
  getPaymentMethod,
  saveAccountDetails,
  saveBillingAddress,
  savePaymentMethod,
} from '@/mock/storage/account-storage';

export function EditAccountPage() {
  const router = useRouter();
  
  // Load data from localStorage or use defaults
  const currentAccountDetails = getAccountDetails(mockAccountDetails);
  const currentBillingAddress = getBillingAddress(mockBillingAddress);
  const currentPaymentMethod = getPaymentMethod(mockPaymentMethod);
  
  // Form state
  const [formData, setFormData] = useState({
    // Account Details
    organization: currentAccountDetails.organization,
    adminEmail: currentAccountDetails.adminEmail,
    taxId: currentAccountDetails.taxId,
    
    // Billing Address
    street: currentBillingAddress.street,
    suite: currentBillingAddress.suite,
    city: currentBillingAddress.city,
    state: currentBillingAddress.state,
    zipCode: currentBillingAddress.zipCode,
    country: currentBillingAddress.country,
    
    // Payment Method
    cardType: currentPaymentMethod.type,
    last4: currentPaymentMethod.last4,
    expiresMonth: currentPaymentMethod.expiresMonth.toString(),
    expiresYear: currentPaymentMethod.expiresYear.toString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.organization || !formData.adminEmail || !formData.street || !formData.city) {
      showToast.error('Please fill in all required fields');
      return;
    }

    // Save to localStorage
    saveAccountDetails({
      organization: formData.organization,
      adminEmail: formData.adminEmail,
      taxId: formData.taxId,
    });

    saveBillingAddress({
      street: formData.street,
      suite: formData.suite,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    });

    savePaymentMethod({
      type: formData.cardType as 'visa' | 'mastercard' | 'amex',
      last4: formData.last4,
      expiresMonth: parseInt(formData.expiresMonth),
      expiresYear: parseInt(formData.expiresYear),
    });

    showToast.success('Account information updated successfully!');
    router.navigate({ to: '/console/admin/plan' });
  };

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/plan' });
  };

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plan Management
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Account Information</h1>
          <p className="text-gray-600">Update your organization, billing, and payment details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                <p className="text-sm text-gray-600">Organization and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="admin@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="US-123456789"
                />
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
                <p className="text-sm text-gray-600">Where invoices should be sent</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suite / Apartment
                </label>
                <input
                  type="text"
                  name="suite"
                  value={formData.suite}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="Suite 400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="94103"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                <p className="text-sm text-gray-600">Credit or debit card information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type
                </label>
                <select
                  name="cardType"
                  value={formData.cardType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  name="last4"
                  value={formData.last4}
                  onChange={handleInputChange}
                  maxLength={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="4242"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month
                </label>
                <select
                  name="expiresMonth"
                  value={formData.expiresMonth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year
                </label>
                <select
                  name="expiresYear"
                  value={formData.expiresYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> For security reasons, we cannot display your full card number. 
                To update your payment method completely, please contact support.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

