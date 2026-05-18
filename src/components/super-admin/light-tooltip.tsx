interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color?: string;
  fill?: string;
}

export function LightTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<TooltipPayloadItem>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-[#ebebeb] bg-white p-3 text-xs shadow-sm">
      <p className="mb-1.5 font-semibold text-[#222222]">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-[#6a6a6a]">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          {p.name}:{' '}
          <span className="ml-0.5 font-medium text-[#222222]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
