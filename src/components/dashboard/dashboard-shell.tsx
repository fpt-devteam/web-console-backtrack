import type { DashboardShellProps } from './types';
import { SiteHeader } from './site-header';
import { SectionCards } from './section-cards';
import { ChartAreaInteractive } from './chart-area-interactive';
import { DataTable } from './data-table';

export function DashboardShell({ header, cards, chart, table }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SiteHeader {...header} />
        <SectionCards cards={cards} />
        <ChartAreaInteractive {...chart} />
        <DataTable {...table} />
      </div>
    </div>
  );
}
