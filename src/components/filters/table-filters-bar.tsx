import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import type { FilterOption } from './filter';

interface FilterDef {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  showAll?: boolean;
  allLabel?: string;
}

interface TableFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<FilterDef>;
  /** e.g. "1–5 of 12" — rendered at the far right */
  resultLabel?: string;
  className?: string;
}

function FilterPill({ filter }: { filter: FilterDef }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const allLabel = filter.allLabel ?? 'All';
  const options: FilterOption[] = filter.showAll === false
    ? filter.options
    : [{ value: 'All', label: allLabel }, ...filter.options];

  const selected = options.find(o => o.value === filter.value);
  const isFiltered = filter.value !== 'All' && filter.value !== '';
  const buttonLabel = isFiltered
    ? `${filter.label}: ${selected?.label ?? filter.value}`
    : filter.label;

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
          isFiltered
            ? 'border-[#222222] bg-[#222222] text-white'
            : 'border-[#dddddd] text-[#222222] bg-white hover:border-[#222222]'
        }`}
      >
        {buttonLabel}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-white border border-[#dddddd] rounded-xl shadow-lg py-1 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { filter.onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-[#222222] hover:bg-[#f7f7f7] transition-colors"
            >
              <span>{opt.label}</span>
              {filter.value === opt.value && <Check className="w-3.5 h-3.5 text-[#222222]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TableFiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  resultLabel,
  className = '',
}: TableFiltersBarProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#dddddd] rounded-full text-sm text-[#222222] placeholder:text-[#929292] bg-white focus:outline-none focus:border-[#222222] transition-colors"
        />
      </div>

      {/* Filter pills */}
      {filters.map((f, i) => <FilterPill key={i} filter={f} />)}

      {/* Result count */}
      {resultLabel && (
        <span className="text-sm text-[#929292] whitespace-nowrap">{resultLabel}</span>
      )}
    </div>
  );
}
