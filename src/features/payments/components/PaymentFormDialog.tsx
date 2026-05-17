// path: frontend/src/features/payments/components/PaymentFormDialog.tsx
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
import { useCreatePayment } from "../hooks/usePayments";
import type { PaymentInput } from "../api/payments.api";

interface Props {
  open: boolean;
  onClose: () => void;
}
const empty: PaymentInput = {
  partyId: "",
  direction: "In",
  mode: "Cash",
  amount: "",
  refNumber: null,
  paymentDate: null,
  narration: null,
};

export function PaymentFormDialog({ open, onClose }: Props) {
  const [form, setForm] = useState<PaymentInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const create = useCreatePayment();
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

  function onFieldKeyDown(
    e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const f = e.currentTarget.form;
    if (!f) return;
    const fields = Array.from(
      f.querySelectorAll("input,select,button[type=submit]"),
    );
    const idx = fields.indexOf(e.currentTarget as Element);
    const next = fields[idx + 1] as HTMLElement | undefined;
    if (next) next.focus();
    else void submit();
  }

  async function submit() {
    setError(null);
    try {
      await create.mutateAsync({
        ...form,
        paymentDate: form.paymentDate || null,
      });
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
    <Dialog open={open} onClose={onClose} title="New Payment">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <Field label="Party ID">
          <Input
            ref={firstFieldRef}
            value={form.partyId}
            onChange={(e) => setForm({ ...form, partyId: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={32}
          />
        </Field>
        <Field label="Direction">
          <select
            value={form.direction}
            onChange={(e) => setForm({ ...form, direction: e.target.value })}
            onKeyDown={onFieldKeyDown}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="In">In (Receipt)</option>
            <option value="Out">Out (Payment)</option>
          </select>
        </Field>
        <Field label="Mode">
          <select
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value })}
            onKeyDown={onFieldKeyDown}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Upi">UPI</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank">Bank</option>
          </select>
        </Field>
        <Field label="Amount">
          <Input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Ref Number">
          <Input
            value={form.refNumber ?? ""}
            onChange={(e) =>
              setForm({ ...form, refNumber: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={50}
          />
        </Field>
        <Field label="Date">
          <Input
            type="date"
            value={form.paymentDate ?? ""}
            onChange={(e) =>
              setForm({ ...form, paymentDate: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
          />
        </Field>
        <Field label="Narration" childrenClassName="col-span-2">
          <Input
            value={form.narration ?? ""}
            onChange={(e) =>
              setForm({ ...form, narration: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={500}
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
  childrenClassName,
}: {
  label: string;
  children: React.ReactNode;
  childrenClassName?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${childrenClassName ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
