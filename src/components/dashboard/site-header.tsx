import type { SiteHeaderConfig } from './types';

export function SiteHeader({ title, subtitle, action }: SiteHeaderConfig) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[#222222] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#6a6a6a] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
