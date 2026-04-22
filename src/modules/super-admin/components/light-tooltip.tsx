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
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-xs shadow-lg">
      <p className="mb-1.5 font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          {p.name}:{' '}
          <span className="ml-0.5 font-medium text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
