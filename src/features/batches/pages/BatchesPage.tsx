// path: frontend/src/features/batches/pages/BatchesPage.tsx
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBatchesQuery } from "../hooks/useBatches";
import { BatchesTable } from "../components/BatchesTable";
import { BatchFormDialog } from "../components/BatchFormDialog";
import type { Batch } from "../api/batches.api";

export function BatchesPage() {
  const [itemId, setItemId] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Batch | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // debounce not needed for itemId since it's an exact match
  const { data, isLoading, isError, error } = useBatchesQuery({
    itemId: itemId.trim() || undefined,
    expiringWithinDays: expiryDays ? Number(expiryDays) : undefined,
    page,
    pageSize: 100,
  });

  useHotkeys("n", (e) => {
    e.preventDefault();
    setOpen(true);
  });
  useHotkeys("/", (e) => {
    e.preventDefault();
    searchRef.current?.focus();
    searchRef.current?.select();
  });

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 100;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-base font-semibold tracking-tight">
          Batch Register
        </h1>
        <span className="text-xs text-muted-foreground">
          {total.toLocaleString()} batches
        </span>
        <Input
          ref={searchRef}
          value={itemId}
          onChange={(e) => {
            setItemId(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by Item ID"
          className="w-40"
        />
        <Input
          type="number"
          value={expiryDays}
          onChange={(e) => {
            setExpiryDays(e.target.value);
            setPage(1);
          }}
          placeholder="Expiry within days"
          className="w-36"
        />
        <div className="ml-auto">
          <Button size="sm" onClick={() => setOpen(true)}>
            + New Batch{" "}
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
          <BatchesTable rows={data?.rows ?? []} onView={(b) => setViewing(b)} />
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
      <BatchFormDialog open={open} onClose={() => setOpen(false)} />
      {viewing && (
        <ViewBatchDialog batch={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function ViewBatchDialog({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onClose={onClose} title={`Batch ${batch.batchNumber}`}>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <Label>Item</Label>
          <p>{batch.item?.name ?? batch.itemId}</p>
        </div>
        <div>
          <Label>Company</Label>
          <p className="text-muted-foreground">
            {batch.item?.company?.name ?? "—"}
          </p>
        </div>
        <div>
          <Label>Expiry</Label>
          <p>{new Date(batch.expiryDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label>Stock Qty</Label>
          <p>{batch.stockQty}</p>
        </div>
        <div>
          <Label>Cost Price</Label>
          <p>{Number(batch.costPrice).toFixed(2)}</p>
        </div>
        <div>
          <Label>MRP</Label>
          <p>{Number(batch.mrp).toFixed(2)}</p>
        </div>
        <div>
          <Label>Selling Price</Label>
          <p>{Number(batch.sellingPrice).toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}
