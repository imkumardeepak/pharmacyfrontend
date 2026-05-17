// path: frontend/src/features/batches/components/BatchFormDialog.tsx
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBatch } from "../hooks/useBatches";
import type { BatchInput } from "../api/batches.api";

interface Props {
  open: boolean;
  onClose: () => void;
}
const empty: BatchInput = {
  itemId: "",
  batchNumber: "",
  expiryDate: "",
  costPrice: "",
  mrp: "",
  sellingPrice: "",
  stockQty: 0,
};

export function BatchFormDialog({ open, onClose }: Props) {
  const [form, setForm] = useState<BatchInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const create = useCreateBatch();
  const busy = create.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(empty);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [open]);

  useHotkeys(
    "f2",
    (e) => {
      e.preventDefault();
      void submit();
    },
    { enabled: open, enableOnFormTags: true },
  );

  function onFieldKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const f = e.currentTarget.form;
    if (!f) return;
    const fields = Array.from(f.querySelectorAll("input,button[type=submit]"));
    const idx = fields.indexOf(e.currentTarget);
    const next = fields[idx + 1] as HTMLElement | undefined;
    if (next) next.focus();
    else void submit();
  }

  async function submit() {
    setError(null);
    try {
      await create.mutateAsync(form);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit();
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Batch">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <Field label="Item ID">
          <Input
            ref={firstFieldRef}
            value={form.itemId}
            onChange={(e) => setForm({ ...form, itemId: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={32}
          />
        </Field>
        <Field label="Batch Number">
          <Input
            value={form.batchNumber}
            onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={50}
          />
        </Field>
        <Field label="Expiry Date">
          <Input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
          />
        </Field>
        <Field label="Stock Qty">
          <Input
            type="number"
            value={form.stockQty}
            onChange={(e) =>
              setForm({ ...form, stockQty: Number(e.target.value) })
            }
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Cost Price">
          <Input
            type="number"
            step="0.01"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="MRP">
          <Input
            type="number"
            step="0.01"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Selling Price">
          <Input
            type="number"
            step="0.01"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        {error && (
          <div className="col-span-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <div className="col-span-2 mt-2 flex items-center justify-between border-t border-border pt-3">
          <p className="text-[10px] text-muted-foreground">
            <kbd className="rounded border border-border px-1">Enter</kbd> next
            · <kbd className="rounded border border-border px-1">F2</kbd> save ·{" "}
            <kbd className="rounded border border-border px-1">Esc</kbd> cancel
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? "Saving…" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
