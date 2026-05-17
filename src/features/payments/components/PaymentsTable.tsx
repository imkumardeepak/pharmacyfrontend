// path: frontend/src/features/payments/components/PaymentsTable.tsx
import { useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Payment } from "../api/payments.api";

interface Props {
  rows: Payment[];
}
const ROW_HEIGHT = 36;

export function PaymentsTable({ rows }: Props) {
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      { accessorKey: "voucherNo", header: "Voucher #", size: 160 },
      { accessorKey: "partyName", header: "Party", size: 220 },
      {
        accessorKey: "direction",
        header: "Dir",
        size: 70,
        cell: (c) => {
          const v = c.getValue<string>();
          return (
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-medium ${v === "In" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
            >
              {v === "In" ? "IN" : "OUT"}
            </span>
          );
        },
      },
      { accessorKey: "mode", header: "Mode", size: 90 },
      {
        accessorKey: "paymentDate",
        header: "Date",
        size: 110,
        cell: (c) => new Date(c.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        size: 120,
        cell: (c) => (
          <div className="tabular text-right font-medium">
            {c.getValue<number>().toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "narration",
        header: "Narration",
        size: 200,
        cell: (c) => (
          <span className="text-muted-foreground text-xs truncate block max-w-[200px]">
            {c.getValue<string | null>() ?? "—"}
          </span>
        ),
      },
    ],
    [],
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
          No payments. Press{" "}
          <kbd className="mx-1 rounded border border-border px-1">N</kbd> to
          create one.
        </div>
      )}
    </div>
  );
}
