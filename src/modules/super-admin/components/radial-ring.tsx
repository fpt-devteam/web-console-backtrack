interface RadialRingProps {
  value: number;
}

export function RadialRing({ value }: RadialRingProps) {
  const r      = 28;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={68} height={68} viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={34} cy={34} r={r} fill="none" stroke="#EFF6FF" strokeWidth={7} />
      <circle
        cx={34} cy={34} r={r}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
