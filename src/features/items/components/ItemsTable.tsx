// path: frontend/src/features/items/components/ItemsTable.tsx
// Virtualized TanStack Table — handles 10k+ rows without lag.
import { useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Item } from "../api/items.api";
import { Button } from "@/components/ui/button";

interface Props {
  rows: Item[];
  onEdit: (item: Item) => void;
  onDeactivate: (item: Item) => void;
}

const ROW_HEIGHT = 36;

export function ItemsTable({ rows, onEdit, onDeactivate }: Props) {
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      { accessorKey: "name", header: "Name", size: 240 },
      { accessorKey: "pack", header: "Pack", size: 60 },
      { accessorKey: "companyName", header: "Company", size: 180 },
      {
        accessorKey: "saltName",
        header: "Salt",
        size: 140,
        cell: (c) => (
          <span className="text-muted-foreground">
            {c.getValue<string | null>() ?? "—"}
          </span>
        ),
      },
      { accessorKey: "hsnCode", header: "HSN", size: 90 },
      {
        accessorKey: "scheduleType",
        header: "Sch",
        size: 50,
        cell: (c) => {
          const v = c.getValue<string>();
          return v !== "None" ? (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
              {v}
            </span>
          ) : null;
        },
      },
      {
        accessorKey: "baseMrp",
        header: () => <div className="text-right">MRP</div>,
        size: 90,
        cell: (c) => (
          <div className="tabular text-right">
            {Number(c.getValue<string>()).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "taxRate",
        header: () => <div className="text-right">GST %</div>,
        size: 70,
        cell: (c) => (
          <div className="tabular text-right">
            {Number(c.getValue<string>()).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        size: 80,
        cell: (c) =>
          c.getValue<boolean>() ? (
            <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
              Active
            </span>
          ) : (
            <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Inactive
            </span>
          ),
      },
      {
        id: "actions",
        header: "",
        size: 160,
        cell: (c) => (
          <div className="flex justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(c.row.original)}
            >
              Edit
            </Button>
            {c.row.original.isActive && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeactivate(c.row.original)}
              >
                Deactivate
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onEdit, onDeactivate],
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
          No items. Press{" "}
          <kbd className="mx-1 rounded border border-border px-1">N</kbd> to
          create one.
        </div>
      )}
    </div>
  );
}
