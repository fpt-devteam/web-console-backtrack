import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type ChipOption = { value: string; label: string }

// ── helpers ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const TODAY = new Date().toISOString().slice(0, 10)

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function fmtDate(v: string): string {
  if (!v) return ''
  return new Date(v + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── FilterDropdownChip ─────────────────────────────────────────────────────

interface FilterDropdownChipProps {
  label: string
  value: string
  defaultValue?: string
  options: Array<ChipOption>
  onChange: (v: string) => void
}

export function FilterDropdownChip({
  label,
  value,
  defaultValue,
  options,
  onChange,
}: FilterDropdownChipProps) {
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const resolvedDefault = defaultValue ?? options[0]?.value ?? ''
  const isDefault = value === resolvedDefault
  const current = options.find((o) => o.value === value)
  const displayLabel = current?.label ?? options[0]?.label

  useEffect(() => {
    if (!open) return
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setAlignRight(rect.left + 200 > window.innerWidth - 8)
    }
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex items-center gap-1.5 h-10 px-4 rounded-full text-sm border bg-white transition-all whitespace-nowrap select-none font-medium',
          open
            ? 'border-[#222222] shadow-md'
            : isDefault
            ? 'border-[#dddddd] hover:border-[#b0b0b0] hover:shadow-sm'
            : 'border-[#222222] hover:shadow-sm',
        ].join(' ')}
      >
        <span className={isDefault ? 'text-[#6a6a6a]' : 'text-[#222222]'}>
          {isDefault ? label : `${label}: ${displayLabel}`}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#888888] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+6px)] ${alignRight ? 'right-0' : 'left-0'} bg-white border border-[#dddddd] rounded-2xl shadow-xl z-50 min-w-[192px] py-1.5 overflow-hidden`}>
          {options.map((opt) => {
            const selected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={[
                  'w-full flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors text-left',
                  selected
                    ? 'bg-[#f7f7f7] text-[#222222] font-semibold'
                    : 'text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222]',
                ].join(' ')}
              >
                <span>{opt.label}</span>
                {selected && <Check className="w-3.5 h-3.5 text-[#222222] flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── RangeMonthGrid ─────────────────────────────────────────────────────────

interface RangeMonthGridProps {
  year: number
  month: number
  fromDate: string
  toDate: string
  hoverDate: string
  onDateClick: (iso: string) => void
  onDateHover: (iso: string) => void
}

function RangeMonthGrid({
  year,
  month,
  fromDate,
  toDate,
  hoverDate,
  onDateClick,
  onDateHover,
}: RangeMonthGridProps) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array.from({ length: firstDow }, (): null => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const effectiveEnd = toDate || (fromDate && hoverDate && hoverDate > fromDate ? hoverDate : '')

  return (
    <div className="w-[232px]">
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#aaaaaa] py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="h-10" />

          const iso = toISO(year, month, day)
          const isStart = iso === fromDate
          const isEnd = iso === toDate
          const isHoverEnd = !toDate && !!fromDate && iso === hoverDate && iso > fromDate
          const inRange = !!(effectiveEnd && fromDate && iso > fromDate && iso < effectiveEnd)
          const isToday = iso === TODAY

          let containerBg: React.CSSProperties = {}
          if (inRange) {
            containerBg = { background: '#f0f0f0' }
          } else if (isStart && effectiveEnd && fromDate < effectiveEnd) {
            containerBg = { background: 'linear-gradient(to right, transparent 50%, #f0f0f0 50%)' }
          } else if (isEnd || isHoverEnd) {
            containerBg = { background: 'linear-gradient(to left, transparent 50%, #f0f0f0 50%)' }
          }

          const btnCls = [
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium relative z-10 transition-colors',
            isStart || isEnd || isHoverEnd
              ? 'bg-[#222222] text-white'
              : inRange
              ? 'text-[#222222] hover:bg-[#e0e0e0]'
              : isToday
              ? 'text-[#ff385c] font-semibold hover:bg-[#f7f7f7]'
              : 'text-[#222222] hover:bg-[#eeeeee]',
          ].join(' ')

          return (
            <div
              key={day}
              className="relative h-10 flex items-center justify-center"
              style={containerBg}
              onMouseEnter={() => onDateHover(iso)}
              onMouseLeave={() => onDateHover('')}
            >
              <button type="button" onClick={() => onDateClick(iso)} className={btnCls}>
                {day}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── FilterDateRangeChip ────────────────────────────────────────────────────

interface FilterDateRangeChipProps {
  fromDate: string
  toDate: string
  onFromDateChange: (v: string) => void
  onToDateChange: (v: string) => void
}

export function FilterDateRangeChip({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: FilterDateRangeChipProps) {
  const [open, setOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState('')
  const [alignRight, setAlignRight] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const [leftYear, setLeftYear] = useState(() => {
    if (fromDate) return new Date(fromDate + 'T00:00:00').getFullYear()
    return new Date().getFullYear()
  })
  const [leftMonth, setLeftMonth] = useState(() => {
    if (fromDate) return new Date(fromDate + 'T00:00:00').getMonth()
    return new Date().getMonth()
  })

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear

  const prevNav = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear((y) => y - 1) }
    else setLeftMonth((m) => m - 1)
  }
  const nextNav = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear((y) => y + 1) }
    else setLeftMonth((m) => m + 1)
  }

  useEffect(() => {
    if (!open) return
    // Detect if panel would overflow viewport right edge → flip to right-0
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setAlignRight(rect.left + 520 > window.innerWidth - 8)
    }
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setHoverDate('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleDateClick = (iso: string) => {
    if (!fromDate || (fromDate && toDate)) {
      onFromDateChange(iso)
      onToDateChange('')
    } else if (iso <= fromDate) {
      onFromDateChange(iso)
      onToDateChange('')
    } else {
      onToDateChange(iso)
      setHoverDate('')
      setOpen(false)
    }
  }

  const hasValue = !!(fromDate || toDate)
  const chipLabel =
    fromDate && toDate
      ? `${fmtDate(fromDate)} – ${fmtDate(toDate)}`
      : fromDate
      ? fmtDate(fromDate)
      : 'Any dates'

  return (
    <div className="relative shrink-0" ref={ref}>
      {/* Chip button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-medium border bg-white transition-all whitespace-nowrap select-none',
          open
            ? 'border-[#222222] shadow-md'
            : hasValue
            ? 'border-[#222222] hover:shadow-sm'
            : 'border-[#dddddd] hover:border-[#b0b0b0] hover:shadow-sm',
        ].join(' ')}
      >
        <Calendar className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" />
        <span className={hasValue ? 'text-[#222222]' : 'text-[#6a6a6a]'}>{chipLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#888888] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Calendar panel */}
      {open && (
        <div className={`absolute top-[calc(100%+6px)] ${alignRight ? 'right-0' : 'left-0'} bg-white border border-[#dddddd] rounded-2xl shadow-xl z-50 overflow-hidden select-none`}>
          {/* Month navigation */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-3">
            <button
              type="button"
              onClick={prevNav}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6a6a6a]" />
            </button>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <p className="text-sm font-semibold text-[#222222] text-center">
                {MONTH_NAMES[leftMonth]} {leftYear}
              </p>
              <p className="text-sm font-semibold text-[#222222] text-center">
                {MONTH_NAMES[rightMonth]} {rightYear}
              </p>
            </div>
            <button
              type="button"
              onClick={nextNav}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6a6a6a]" />
            </button>
          </div>

          {/* Two-month grids */}
          <div className="flex items-start px-5 pb-5 gap-6">
            <RangeMonthGrid
              year={leftYear}
              month={leftMonth}
              fromDate={fromDate}
              toDate={toDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
            <div className="w-px self-stretch bg-[#eeeeee]" />
            <RangeMonthGrid
              year={rightYear}
              month={rightMonth}
              fromDate={fromDate}
              toDate={toDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#f0f0f0] flex items-center justify-between min-h-[44px]">
            <p className="text-xs text-[#929292]">
              {fromDate && toDate
                ? `${fmtDate(fromDate)} – ${fmtDate(toDate)}`
                : fromDate
                ? 'Select end date'
                : 'Select start date'}
            </p>
            {hasValue && (
              <button
                type="button"
                onClick={() => {
                  onFromDateChange('')
                  onToDateChange('')
                }}
                className="text-xs font-medium text-[#929292] hover:text-[#c13515] transition-colors underline underline-offset-2"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
