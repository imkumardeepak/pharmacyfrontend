// path: frontend/src/features/batches/components/BatchesTable.tsx
import { useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Batch } from "../api/batches.api";
import { Button } from "@/components/ui/button";

interface Props {
  rows: Batch[];
  onView: (b: Batch) => void;
}
const ROW_HEIGHT = 36;

export function BatchesTable({ rows, onView }: Props) {
  const columns = useMemo<ColumnDef<Batch>[]>(
    () => [
      { accessorKey: "batchNumber", header: "Batch #", size: 160 },
      {
        id: "itemName",
        header: "Item",
        size: 220,
        cell: (c) => c.row.original.item?.name ?? c.row.original.itemId,
      },
      {
        id: "companyName",
        header: "Company",
        size: 160,
        cell: (c) => (
          <span className="text-muted-foreground text-xs">
            {c.row.original.item?.company?.name ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry",
        size: 120,
        cell: (c) => {
          const d = new Date(c.getValue<string>());
          const isExpiring = d < new Date(Date.now() + 90 * 86400000);
          return (
            <span className={isExpiring ? "text-amber-600 font-medium" : ""}>
              {d.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        accessorKey: "stockQty",
        header: () => <div className="text-right">Qty</div>,
        size: 80,
        cell: (c) => (
          <div className="tabular text-right">{c.getValue<number>()}</div>
        ),
      },
      {
        accessorKey: "costPrice",
        header: () => <div className="text-right">Cost</div>,
        size: 90,
        cell: (c) => (
          <div className="tabular text-right">
            {Number(c.getValue<string>()).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "mrp",
        header: () => <div className="text-right">MRP</div>,
        size: 90,
        cell: (c) => (
          <div className="tabular text-right">
            {Number(c.getValue<string>()).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "sellingPrice",
        header: () => <div className="text-right">Sell</div>,
        size: 90,
        cell: (c) => (
          <div className="tabular text-right">
            {Number(c.getValue<string>()).toFixed(2)}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 100,
        cell: (c) => (
          <div className="flex justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(c.row.original)}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const virt = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-auto rounded-md border border-border bg-card"
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-card text-xs uppercase tracking-wide text-muted-foreground">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{ width: h.getSize() }}
                  className="px-3 py-2 text-left font-medium"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            height: virt.getTotalSize(),
            position: "relative",
            display: "block",
          }}
        >
          {virt.getVirtualItems().map((vi) => {
            const row = table.getRowModel().rows[vi.index];
            return (
              <tr
                key={row.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: ROW_HEIGHT,
                  transform: `translateY(${vi.start}px)`,
                  display: "table",
                  tableLayout: "fixed",
                }}
                className="border-b border-border hover:bg-accent/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="px-3 py-1.5 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No batches found.
        </div>
      )}
    </div>
  );
}
