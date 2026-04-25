import type { ReactNode } from 'react';
import { ArrowRightLeft, PackageCheck, Smartphone } from 'lucide-react';

type TableRow =
  | { kind: 'section'; title: string; hint?: string }
  | { kind: 'field'; label: string; value: ReactNode };

function IdText({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[#222222] tabular-nums">{children}</span>;
}

function TableBody({ rows }: { rows: TableRow[] }) {
  return (
    <tbody>
      {rows.map((row, i) => {
        if (row.kind === 'section') {
          return (
            <tr key={`s-${i}-${row.title}`} className="bg-[#f7f7f7] border-y border-[#ebebeb]">
              <td colSpan={2} className="py-2.5 px-4">
                <div className="text-xs font-bold uppercase tracking-wide text-[#222222]">{row.title}</div>
                {row.hint ? <div className="text-[11px] text-[#6a6a6a] mt-0.5">{row.hint}</div> : null}
              </td>
            </tr>
          );
        }
        return (
          <tr key={`f-${i}-${row.label}`} className="border-b border-[#ebebeb] last:border-0">
            <td className="py-3 px-4 text-[#6a6a6a] align-top w-[40%]">{row.label}</td>
            <td className="py-3 px-4 text-[#222222] align-top">{row.value}</td>
          </tr>
        );
      })}
    </tbody>
  );
}

export function InventoryDetailMockPanels() {
  const handoverRows: TableRow[] = [
    {
      kind: 'section',
      title: 'Finder — contact & ID',
      hint: 'Person who found the item or handed it in for storage.',
    },
    { kind: 'field', label: 'Full name', value: 'Alex Tran' },
    { kind: 'field', label: 'Email', value: <span className="text-[#222222]">alex.tran@campus.edu</span> },
    {
      kind: 'section',
      title: 'Finder — identification (at least one)',
      hint: 'National ID number and/or student or staff ID — stored as text and numbers only .',
    },
    {
      kind: 'field',
      label: 'National ID / citizen ID ',
      value: <IdText>079092******441</IdText>,
    },
    {
      kind: 'field',
      label: 'Student / staff ID ',
      value: <IdText>STU-22123456</IdText>,
    },
    {
      kind: 'field',
      label: 'Phone number',
      value: (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-[#6a6a6a] shrink-0" />
          <IdText>+1 903 ···· 6782</IdText>
        </span>
      ),
    },
    { kind: 'section', title: 'Intake / handover to facility', hint: 'When the item entered your process.' },
    { kind: 'field', label: 'Handover time', value: 'Mar 10, 2026 · 09:15' },
    { kind: 'field', label: 'From · To', value: 'Finder at desk → Staging area A' },
    { kind: 'field', label: 'Receiving staff', value: 'Jordan Nguyen' },
    { kind: 'field', label: 'Notes', value: 'Condition check before storage intake.' },
  ];

  const returnRows: TableRow[] = [
    {
      kind: 'section',
      title: 'Recipient — contact & ID',
      hint: 'Person picking up the item (owner or authorized claimant).',
    },
    { kind: 'field', label: 'Full name', value: 'Morgan Lee' },
    { kind: 'field', label: 'Email (optional)', value: <span className="text-[#222222]">morgan.lee@email.com</span> },
    {
      kind: 'section',
      title: 'Recipient — identification (at least one)',
      hint: 'Must match your release policy. Text and numbers only .',
    },
    {
      kind: 'field',
      label: 'National ID / citizen ID ',
      value: <IdText>079185******123</IdText>,
    },
    {
      kind: 'field',
      label: 'Student / staff ID ',
      value: <IdText>STF-88012</IdText>,
    },
    {
      kind: 'field',
      label: 'Phone number',
      value: (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-[#6a6a6a] shrink-0" />
          <IdText>+1 415 ···· 9021</IdText>
        </span>
      ),
    },
    { kind: 'section', title: 'Return release', hint: 'When the item leaves storage to the recipient.' },
    {
      kind: 'field',
      label: 'Status',
      value: (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f7f7f7] text-[#222222]">
          Ready for pickup
        </span>
      ),
    },
    { kind: 'field', label: 'Expected / actual pickup date', value: 'Mar 20, 2026 / —' },
    { kind: 'field', label: 'Releasing staff', value: 'Taylor Kim' },
    { kind: 'field', label: 'Signature / confirmation', value: <span className="text-[#929292] italic">Pending pickup</span> },
  ];

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3 border-b border-[#ebebeb] bg-[#f7f7f7]">
            <div className="flex items-center gap-2 text-[#222222]">
              <ArrowRightLeft className="w-5 h-5 shrink-0" />
              <div>
                <h2 className="text-base font-semibold text-[#222222]">Storage / handover</h2>
                <p className="text-xs text-[#929292] mt-0.5">Finder — who found or turned in the item</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableBody rows={handoverRows} />
            </table>
          </div>
        </section>

        <section className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3 border-b border-[#ebebeb] bg-[#f7f7f7]">
            <div className="flex items-center gap-2 text-[#222222]">
              <PackageCheck className="w-5 h-5 shrink-0" />
              <div>
                <h2 className="text-base font-semibold text-[#222222]">Return to owner</h2>
                <p className="text-xs text-[#929292] mt-0.5">Recipient — who receives the item</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableBody rows={returnRows} />
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
