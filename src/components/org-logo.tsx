import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrgLogoProps = {
  logoUrl?: string | null;
  alt?: string;
  /** Outer size, e.g. w-10 h-10 */
  className?: string;
  iconClassName?: string;
  rounded?: 'full' | 'lg';
};

/**
 * Organization mark: image when `logoUrl` is set, otherwise Building2 on blue (matches previous sidebar).
 */
export function OrgLogo({
  logoUrl,
  alt = 'Organization',
  className = 'w-10 h-10',
  iconClassName = 'w-6 h-6',
  rounded = 'full',
}: OrgLogoProps) {
  const roundCls = rounded === 'full' ? 'rounded-full' : 'rounded-lg';
  if (logoUrl?.trim()) {
    return (
      <div className={cn('overflow-hidden bg-gray-100 flex-shrink-0', roundCls, className)}>
        <img src={logoUrl.trim()} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={cn('flex flex-shrink-0 items-center justify-center bg-blue-500', roundCls, className)}>
      <Building2 className={cn('text-white', iconClassName)} aria-hidden />
    </div>
  );
}
