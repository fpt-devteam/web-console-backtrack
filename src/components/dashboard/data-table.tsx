import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableConfig } from './types';

export function DataTable({ title, columns, data, pageSize = 5 }: TableConfig) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-[#dddddd]">
          <h2 className="text-base font-semibold text-[#222222]">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f7f7f7] border-b border-[#dddddd]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider cursor-pointer select-none hover:text-[#222222]"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() &&
                        (h.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : h.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 text-[#dddddd]" />
                        ))}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[#f7f7f7]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#f7f7f7] transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3.5 text-sm text-[#222222]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#dddddd]">
        <span className="text-xs text-[#929292]">
          {data.length} total rows
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            className="p-1.5 rounded-lg border border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[#6a6a6a] px-2">
            {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
          </span>
          <button
            type="button"
            aria-label="Next page"
            className="p-1.5 rounded-lg border border-[#dddddd] text-[#6a6a6a] hover:border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
