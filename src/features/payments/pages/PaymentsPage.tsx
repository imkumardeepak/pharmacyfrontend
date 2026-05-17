// path: frontend/src/features/payments/pages/PaymentsPage.tsx
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { usePaymentsQuery } from "../hooks/usePayments";
import { PaymentsTable } from "../components/PaymentsTable";
import { PaymentFormDialog } from "../components/PaymentFormDialog";

export function PaymentsPage() {
  const [direction, setDirection] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = usePaymentsQuery({
    direction: direction || undefined,
    page,
    pageSize: 50,
  });

  useHotkeys("n", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight">Payments</h1>
        <span className="text-xs text-muted-foreground">
          {total.toLocaleString()} payments
        </span>
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
            setPage(1);
          }}
          className="ml-2 h-8 rounded-md border border-border bg-background px-2 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">All</option>
          <option value="In">Receipts (In)</option>
          <option value="Out">Payments (Out)</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={() => setOpen(true)}>
            + New Payment{" "}
            <kbd className="ml-1 rounded bg-primary-foreground/20 px-1 text-[10px]">
              N
            </kbd>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {isError ? (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            Failed to load: {(error as Error).message}
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : (
          <PaymentsTable rows={data?.rows ?? []} />
        )}
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>
          Page {page} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
      <PaymentFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
