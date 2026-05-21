import type { PageHeaderConfig } from './page-header';
import type { CardConfig } from './section-cards';
import type { ChartConfig } from './area-chart';
import type { TableConfig } from './data-table';
import { PageHeader } from './page-header';
import { SectionCards } from './section-cards';
import { AreaChart } from './area-chart';
import { DataTable } from './data-table';

export interface DashboardShellProps {
  header: PageHeaderConfig;
  cards: CardConfig[];
  chart: ChartConfig;
  table: TableConfig;
}

export function DashboardShell({ header, cards, chart, table }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6 md:p-8">
      <div className="mx-auto space-y-6">
        <PageHeader {...header} />
        <SectionCards cards={cards} />
        <AreaChart {...chart} />
        <DataTable {...table} />
      </div>
    </div>
  );
}
