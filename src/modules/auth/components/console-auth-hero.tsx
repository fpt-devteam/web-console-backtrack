import logo from '@/assets/backtrack-logo.svg';
import { LayoutDashboard, ShieldCheck, Users } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: 'Role-based access for verified organisations' },
  { icon: LayoutDashboard, text: 'Live operational dashboards & inventory' },
  { icon: Users, text: 'Team invites across admin and staff workspaces' },
] as const;

export function ConsoleAuthHero() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0c0c0c] px-16 py-14 lg:flex lg:w-1/2">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand-400/10 blur-[80px]" />

      <div className="relative z-10">
        <img src={logo} alt="Backtrack" className="h-7 w-auto brightness-0 invert" draggable={false} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">Organisation console · SaaS</p>
          <h1 className="text-4xl leading-[1.1] font-black tracking-tight text-white xl:text-5xl">
            Operate lost &amp; found
            <br />
            at organisational scale.
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-white/50">
            One trusted workspace for intakes, handovers, and staff coordination — purpose-built for venues and
            networks running recovery programmes at volume.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-4 w-4 text-brand-400" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-sm font-medium text-white/70">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 pt-8">
        <p className="max-w-xs text-sm leading-relaxed text-white/40 italic">
          &ldquo;Replacing spreadsheets with one console tightened our approvals overnight.&rdquo;
        </p>
        <p className="mt-2 text-xs font-semibold tracking-wide text-white/30">
          — Platform admin, logistics hub
        </p>
      </div>
    </div>
  );
}
