import { useEffect, useState } from 'react';

import { MapPin } from 'lucide-react';

import type { RecentActivityItem } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';

const STATUS_STYLE: Record<string, string> = {
  Found:    'bg-green-100 text-green-700',
  Returned: 'bg-purple-100 text-purple-700',
  Lost:     'bg-red-100 text-red-700',
  Active:   'bg-blue-100 text-blue-700',
};

const AVATAR_BG: Record<string, string> = {
  Found:    'bg-green-50 text-green-600',
  Returned: 'bg-purple-50 text-purple-600',
  Lost:     'bg-red-50 text-red-600',
  Active:   'bg-blue-50 text-blue-600',
};

const STATUS_FILTERS = [
  { label: 'All',      value: undefined  },
  { label: 'Active',   value: 'Active'   },
  { label: 'Returned', value: 'Returned' },
  { label: 'Archived', value: 'Archived' },
  { label: 'Expired',  value: 'Expired'  },
] as const;

export function RecentActivity() {
  const [items, setItems] = useState<Array<RecentActivityItem>>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    superAdminService.getRecentActivity({ status: statusFilter })
      .then(setItems)
      .catch(console.error);
  }, [statusFilter]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
              statusFilter === s.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.postId} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_BG[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {a.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{a.title}</p>
              <p className="flex items-center gap-1 truncate text-xs text-gray-400">
                <MapPin className="h-3 w-3 shrink-0" />
                {a.location} · {a.timeAgo}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
