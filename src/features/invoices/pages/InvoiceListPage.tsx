// path: frontend/src/features/invoices/pages/InvoiceListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { useInvoicesQuery } from "../hooks/useInvoices";
import { InvoicesTable } from "../components/InvoicesTable";

export function InvoiceListPage() {
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useInvoicesQuery({
    type: type || undefined,
    page,
    pageSize: 50,
  });

  useHotkeys("/", (e) => {
    e.preventDefault();
  });
  useHotkeys("n", (e) => {
    e.preventDefault();
    navigate("/invoices/cash-sale");
  });

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Invoices</h1>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {total.toLocaleString()} invoices
          </span>
        </div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">All Types</option>
          <option value="CashSale">Cash Sale</option>
          <option value="CreditSale">Credit Sale</option>
          <option value="Purchase">Purchase</option>
        </select>
        <div className="ml-auto flex items-center gap-3">
          <Button size="sm" onClick={() => navigate("/invoices/cash-sale")}>
            + Cash Sale{" "}
            <kbd className="ml-1 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]">
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
          <InvoicesTable rows={data?.rows ?? []} />
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
    </div>
  );
}
