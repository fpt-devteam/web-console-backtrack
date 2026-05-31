export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[3fr_7fr] items-start gap-3 py-1 last:border-0">
      <dt className="text-xs font-medium text-gray-500 pt-0.5">{label}</dt>
      <dd className="text-sm font-semibold text-right text-gray-800 break-words">{value}</dd>
    </div>
  )
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="h-4 w-1 rounded-full bg-rose-400 shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</span>
    </div>
  )
}
