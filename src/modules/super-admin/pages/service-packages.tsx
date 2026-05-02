import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import {
  Archive,
  Check,
  Loader2,
  Package,
  Pencil,
  Plus,
  X,
} from 'lucide-react';
import { showToast } from '@/lib/toast';
import { adminPlanService } from '@/services/admin-plan.service';
import type { AdminPlan, CreatePlanRequest } from '@/types/admin-user.types';

// ── types ──────────────────────────────────────────────────────────────────

type DialogState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit-features'; plan: AdminPlan }
  | { type: 'archive'; plan: AdminPlan };

const BLANK_FORM: CreatePlanRequest = {
  name: '',
  price: 0,
  currency: 'USD',
  billingInterval: 'Monthly',
  subscriberType: 'Organization',
  features: [''],
  providerPriceId: '',
};

// ── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

// ── sub-components ─────────────────────────────────────────────────────────

function FeatureListEditor({
  features,
  onChange,
}: {
  features: string[];
  onChange: (f: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...features];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  const add = () => onChange([...features, '']);

  return (
    <div className="space-y-2">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={f}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 border border-[#dddddd] rounded-[10px] px-3 py-1.5 text-sm focus:outline-none focus:border-[#222222]"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={features.length === 1}
            className="text-[#929292] hover:text-[#c13515] disabled:opacity-30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-[#0070f3] hover:text-[#0060d3] font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add feature
      </button>
    </div>
  );
}

function PlanCard({
  plan,
  onEditFeatures,
  onArchive,
}: {
  plan: AdminPlan;
  onEditFeatures: (p: AdminPlan) => void;
  onArchive: (p: AdminPlan) => void;
}) {
  return (
    <div className={`bg-white rounded-[14px] border border-[#dddddd] overflow-hidden flex flex-col transition-opacity ${!plan.isActive ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="px-5 py-5 border-b border-[#f0f0f0]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-[#222222] leading-tight">{plan.name}</h3>
          <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            plan.isActive
              ? 'bg-[#e8f9f0] text-[#06c167]'
              : 'bg-[#f5f5f5] text-[#929292]'
          }`}>
            {plan.isActive ? 'Active' : 'Archived'}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#222222]">{formatPrice(plan.price, plan.currency)}</span>
          <span className="text-sm text-[#6a6a6a]">/{plan.billingInterval === 'Monthly' ? 'mo' : 'yr'}</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 py-4 flex-1">
        <p className="text-xs text-[#6a6a6a] font-medium mb-3 uppercase tracking-wider">Features</p>
        {plan.features.length === 0 ? (
          <p className="text-sm text-[#929292] italic">No features listed</p>
        ) : (
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#e8f9f0] flex items-center justify-center mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#06c167]" />
                </div>
                <span className="text-sm text-[#222222]">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      {plan.isActive && (
        <div className="px-5 py-4 border-t border-[#f0f0f0] flex items-center gap-2">
          <button
            onClick={() => onEditFeatures(plan)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors active:scale-[0.96]"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Features
          </button>
          <button
            onClick={() => onArchive(plan)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#ffd6d6] text-[#c13515] rounded-[20px] text-sm font-medium hover:bg-[#fff0f2] transition-colors active:scale-[0.96]"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function PlansSection({
  title,
  plans,
  onEditFeatures,
  onArchive,
}: {
  title: string;
  plans: AdminPlan[];
  onEditFeatures: (p: AdminPlan) => void;
  onArchive: (p: AdminPlan) => void;
}) {
  if (plans.length === 0) return null;
  return (
    <div>
      <h2 className="text-base font-semibold text-[#222222] mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} onEditFeatures={onEditFeatures} onArchive={onArchive} />
        ))}
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export function ServicePackagesPage() {
  const [orgPlans, setOrgPlans] = useState<AdminPlan[]>([]);
  const [userPlans, setUserPlans] = useState<AdminPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const [isSaving, setIsSaving] = useState(false);

  // create form state
  const [form, setForm] = useState<CreatePlanRequest>(BLANK_FORM);

  // edit-features state
  const [editFeatures, setEditFeatures] = useState<string[]>([]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const grouped = await adminPlanService.getPlans();
      setOrgPlans(grouped.organization ?? []);
      setUserPlans(grouped.user ?? []);
    } catch {
      showToast.error('Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadPlans(); }, []);

  // ── handlers ──

  const openCreate = () => {
    setForm(BLANK_FORM);
    setDialog({ type: 'create' });
  };

  const openEditFeatures = (plan: AdminPlan) => {
    setEditFeatures(plan.features.length ? [...plan.features] : ['']);
    setDialog({ type: 'edit-features', plan });
  };

  const openArchive = (plan: AdminPlan) => setDialog({ type: 'archive', plan });
  const closeDialog = () => setDialog({ type: 'none' });

  const handleCreate = async () => {
    if (!form.name.trim() || !form.providerPriceId.trim()) {
      showToast.error('Name and Stripe Price ID are required.');
      return;
    }
    const features = form.features.map((f) => f.trim()).filter(Boolean);
    setIsSaving(true);
    try {
      const created = await adminPlanService.createPlan({ ...form, features });
      if (created.subscriberType === 'Organization') {
        setOrgPlans((prev) => [...prev, created]);
      } else {
        setUserPlans((prev) => [...prev, created]);
      }
      closeDialog();
      showToast.success('Plan created.');
    } catch (err: any) {
      showToast.error(err?.response?.data?.error?.message ?? err.message ?? 'Failed to create plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditFeatures = async () => {
    if (dialog.type !== 'edit-features') return;
    const features = editFeatures.map((f) => f.trim()).filter(Boolean);
    setIsSaving(true);
    try {
      const updated = await adminPlanService.updateFeatures(dialog.plan.id, features);
      const updater = (plans: AdminPlan[]) =>
        plans.map((p) => (p.id === updated.id ? { ...p, features: updated.features } : p));
      setOrgPlans(updater);
      setUserPlans(updater);
      closeDialog();
      showToast.success('Features updated.');
    } catch (err: any) {
      showToast.error(err?.response?.data?.error?.message ?? err.message ?? 'Failed to update features.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (dialog.type !== 'archive') return;
    setIsSaving(true);
    try {
      await adminPlanService.archivePlan(dialog.plan.id);
      const updater = (plans: AdminPlan[]) =>
        plans.map((p) => (p.id === dialog.plan.id ? { ...p, isActive: false } : p));
      setOrgPlans(updater);
      setUserPlans(updater);
      closeDialog();
      showToast.success('Plan archived.');
    } catch (err: any) {
      showToast.error(err?.response?.data?.error?.message ?? err.message ?? 'Failed to archive plan.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── render ──

  return (
    <Layout>
      <div className="p-8 bg-[#f7f7f7] min-h-screen">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] mb-1">Service Package</h1>
            <p className="text-[#6a6a6a]">Manage subscription packages, pricing, and features.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-medium bg-[#ff385c] text-white border border-transparent hover:bg-white hover:text-[#ff385c] hover:border-[#ff385c] transition-colors active:scale-[0.96]"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-[#6a6a6a]" />
          </div>
        ) : orgPlans.length === 0 && userPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-14 h-14 rounded-full bg-white border border-[#dddddd] flex items-center justify-center">
              <Package className="w-6 h-6 text-[#929292]" />
            </div>
            <p className="text-[#6a6a6a] text-sm">No plans yet. Create your first package.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <PlansSection
              title="Organization Plans"
              plans={orgPlans}
              onEditFeatures={openEditFeatures}
              onArchive={openArchive}
            />
            <PlansSection
              title="User Plans"
              plans={userPlans}
              onEditFeatures={openEditFeatures}
              onArchive={openArchive}
            />
          </div>
        )}
      </div>

      {/* ── Create Plan Dialog ── */}
      {dialog.type === 'create' && (
        <DialogShell title="Create Plan" onClose={closeDialog}>
          <div className="space-y-4">
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Org Pro"
                className="w-full border border-[#dddddd] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#222222]"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (USD)">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-[#dddddd] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#222222]"
                />
              </Field>
              <Field label="Billing Interval">
                <select
                  value={form.billingInterval}
                  onChange={(e) => setForm((f) => ({ ...f, billingInterval: e.target.value as 'Monthly' | 'Yearly' }))}
                  className="w-full border border-[#dddddd] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#222222]"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </Field>
            </div>

            <Field label="Subscriber Type">
              <select
                value={form.subscriberType}
                onChange={(e) => setForm((f) => ({ ...f, subscriberType: e.target.value as 'User' | 'Organization' }))}
                className="w-full border border-[#dddddd] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#222222]"
              >
                <option value="Organization">Organization</option>
                <option value="User">User</option>
              </select>
            </Field>

            <Field label="Stripe Price ID">
              <input
                value={form.providerPriceId}
                onChange={(e) => setForm((f) => ({ ...f, providerPriceId: e.target.value }))}
                placeholder="price_1ABC..."
                className="w-full border border-[#dddddd] rounded-[10px] px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#222222]"
              />
            </Field>

            <Field label="Features">
              <FeatureListEditor
                features={form.features}
                onChange={(features) => setForm((f) => ({ ...f, features }))}
              />
            </Field>
          </div>

          <DialogActions
            confirmLabel="Create Plan"
            onConfirm={() => void handleCreate()}
            onCancel={closeDialog}
            isLoading={isSaving}
          />
        </DialogShell>
      )}

      {/* ── Edit Features Dialog ── */}
      {dialog.type === 'edit-features' && (
        <DialogShell title={`Edit Features — ${dialog.plan.name}`} onClose={closeDialog}>
          <FeatureListEditor features={editFeatures} onChange={setEditFeatures} />
          <DialogActions
            confirmLabel="Save Features"
            onConfirm={() => void handleEditFeatures()}
            onCancel={closeDialog}
            isLoading={isSaving}
          />
        </DialogShell>
      )}

      {/* ── Archive Confirmation Dialog ── */}
      {dialog.type === 'archive' && (
        <DialogShell title="Archive Plan?" onClose={closeDialog}>
          <div className="bg-[#f7f7f7] rounded-[12px] px-4 py-3 text-sm text-[#6a6a6a]">
            <span className="font-medium text-[#222222]">{dialog.plan.name}</span> will no longer
            appear in the public plan list. Existing subscribers are unaffected.
          </div>
          <p className="text-xs text-[#929292] mt-2">
            This is blocked if the plan still has active subscribers.
          </p>
          <DialogActions
            confirmLabel="Archive"
            confirmClass="bg-[#c13515] hover:bg-[#a02a10]"
            onConfirm={() => void handleArchive()}
            onCancel={closeDialog}
            isLoading={isSaving}
          />
        </DialogShell>
      )}
    </Layout>
  );
}

// ── shared dialog primitives ───────────────────────────────────────────────

function DialogShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-md p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#222222]">{title}</h3>
          <button onClick={onClose} className="text-[#929292] hover:text-[#222222] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function DialogActions({
  confirmLabel,
  confirmClass = 'bg-[#222222] hover:bg-[#333333]',
  onConfirm,
  onCancel,
  isLoading,
}: {
  confirmLabel: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 py-2.5 border border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`flex-1 py-2.5 text-white rounded-[20px] text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${confirmClass}`}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {confirmLabel}
      </button>
    </div>
  );
}
