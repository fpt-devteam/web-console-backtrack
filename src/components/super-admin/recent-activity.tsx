import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

import type { RecentActivityItem } from '@/services/super-admin.service';
import { superAdminService } from '@/services/super-admin.service';

const STATUS_STYLE: Record<string, string> = {
  Found:    'bg-[#e8f9f0] text-[#06c167]',
  Returned: 'bg-[#f7f7f7] text-[#6a6a6a]',
  Lost:     'bg-[#fff0f2] text-[#c13515]',
  Active:   'bg-[#f7f7f7] text-[#222222]',
};

const AVATAR_BG: Record<string, string> = {
  Found:    'bg-[#e8f9f0] text-[#06c167]',
  Returned: 'bg-[#f7f7f7] text-[#6a6a6a]',
  Lost:     'bg-[#fff0f2] text-[#c13515]',
  Active:   'bg-[#f7f7f7] text-[#222222]',
};

const STATUS_FILTERS = [
  { label: 'All',      value: undefined  },
  { label: 'Active',   value: 'Active'   },
  { label: 'Returned', value: 'Returned' },
  { label: 'Archived', value: 'Archived' },
  { label: 'Expired',  value: 'Expired'  },
] as const;

const PAGE_SIZE = 3;

export function RecentActivity() {
  const [items, setItems] = useState<Array<RecentActivityItem>>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    superAdminService.getRecentActivity({ status: statusFilter, page, pageSize: PAGE_SIZE })
      .then(res => { setItems(res.data); setTotal(res.total); })
      .catch(console.error);
  }, [statusFilter, page]);

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[#222222]">Recent Activity</h2>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all active:scale-[0.92] ${
              statusFilter === s.value
                ? 'bg-[#222222] text-white'
                : 'bg-[#f7f7f7] text-[#6a6a6a] hover:bg-[#ebebeb]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.postId} className="flex items-center gap-3 rounded-lg bg-[#f7f7f7] px-3 py-2.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_BG[a.status] ?? 'bg-[#f7f7f7] text-[#6a6a6a]'}`}>
              {a.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#222222]">{a.title}</p>
              <p className="flex items-center gap-1 truncate text-xs text-[#929292]">
                <MapPin className="h-3 w-3 shrink-0" />
                {a.location} · {a.timeAgo}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[a.status] ?? 'bg-[#f7f7f7] text-[#6a6a6a]'}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#929292]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#929292] hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#929292] hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
