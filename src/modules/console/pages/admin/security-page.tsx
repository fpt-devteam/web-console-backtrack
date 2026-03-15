import { Layout } from '@/modules/console/components/admin/layout';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { showToast } from '@/lib/toast';

export function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!currentPassword.trim()) e.currentPassword = 'Current password is required';
    if (!newPassword.trim()) e.newPassword = 'New password is required';
    else if (newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const user = auth.currentUser as FirebaseUser | null;
    if (!user?.email) {
      showToast.error('You must be signed in to change password.');
      return;
    }

    setIsSubmitting(true);
    setPasswordErrors({});

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showToast.success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const message =
        code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : code === 'auth/weak-password'
            ? 'New password should be at least 6 characters.'
            : (err as Error)?.message || 'Failed to update password.';
      showToast.error(message);
      setPasswordErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-12 pr-12 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      passwordErrors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mx-10 ">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Security</h1>
            <p className="text-gray-600">Change your password.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Change password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {passwordErrors.form && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{passwordErrors.form}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass('currentPassword')}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle visibility"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass('newPassword')}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle visibility"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass('confirmPassword')}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle visibility"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
