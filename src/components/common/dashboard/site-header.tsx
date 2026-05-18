import type { SiteHeaderConfig } from './types';

export function SiteHeader({ title, subtitle, action }: SiteHeaderConfig) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#222222] mb-1">{title}</h1>
        {subtitle && <p className="text-[#6a6a6a]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
