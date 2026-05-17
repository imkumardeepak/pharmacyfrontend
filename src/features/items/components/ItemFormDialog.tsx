// path: frontend/src/features/items/components/ItemFormDialog.tsx
// Keyboard-first form. Enter advances focus to the next field; F2 saves; Esc closes.
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
import { useCreateItem, useUpdateItem } from "../hooks/useItems";
import type { Item, ItemInput } from "../api/items.api";

interface Props {
  open: boolean;
  initial?: Item | null;
  onClose: () => void;
}

const empty: ItemInput = {
  name: "",
  pack: "1",
  hsnCode: "",
  baseMrp: "",
  taxRate: "",
  scheduleType: "None",
  isNarcotic: false,
  barcode: null,
  saltId: null,
  companyId: "",
};

export function ItemFormDialog({ open, initial, onClose }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ItemInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const create = useCreateItem();
  const update = useUpdateItem();
  const busy = create.isPending || update.isPending;

  // Reset form when dialog opens / initial changes
  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      initial
        ? {
            name: initial.name,
            pack: initial.pack,
            hsnCode: initial.hsnCode,
            baseMrp: initial.baseMrp,
            taxRate: initial.taxRate,
            scheduleType: initial.scheduleType,
            isNarcotic: initial.isNarcotic,
            barcode: initial.barcode,
            saltId: initial.saltId,
            companyId: initial.companyId,
          }
        : empty,
    );
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [open, initial]);

  // F2 = Save (scoped to this dialog)
  useHotkeys(
    "f2",
    (e) => {
      e.preventDefault();
      void submit();
    },
    { enabled: open, enableOnFormTags: true },
  );

  // Enter advances focus across fields; submit only on the last one.
  function onFieldKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const form = e.currentTarget.form;
    if (!form) return;
    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        "input,select,button[type=submit]",
      ),
    );
    const idx = fields.indexOf(e.currentTarget);
    const next = fields[idx + 1];
    if (next) next.focus();
    else void submit();
  }

  async function submit() {
    setError(null);
    try {
      if (isEdit && initial) {
        await update.mutateAsync({ id: initial.id, input: form });
      } else {
        await create.mutateAsync(form);
      }
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
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Item — ${initial?.name}` : "New Item"}
    >
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <Input
            ref={firstFieldRef}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={200}
          />
        </Field>
        <Field label="Company ID">
          <Input
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={32}
          />
        </Field>
        <Field label="Salt ID">
          <Input
            value={form.saltId ?? ""}
            onChange={(e) =>
              setForm({ ...form, saltId: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={32}
          />
        </Field>
        <Field label="Pack">
          <Input
            value={form.pack}
            onChange={(e) => setForm({ ...form, pack: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={20}
          />
        </Field>
        <Field label="HSN Code">
          <Input
            value={form.hsnCode}
            onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
          />
        </Field>
        <Field label="Barcode">
          <Input
            value={form.barcode ?? ""}
            onChange={(e) =>
              setForm({ ...form, barcode: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
          />
        </Field>
        <Field label="Base MRP">
          <Input
            type="number"
            step="0.01"
            value={form.baseMrp}
            onChange={(e) => setForm({ ...form, baseMrp: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Tax Rate (%)">
          <Input
            type="number"
            step="0.01"
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Schedule Type">
          <Input
            value={form.scheduleType}
            onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            maxLength={10}
          />
        </Field>
        <Field label="Narcotic">
          <Input
            type="checkbox"
            checked={form.isNarcotic}
            onChange={(e) => setForm({ ...form, isNarcotic: e.target.checked })}
            className="h-9 w-9"
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
              {busy ? "Saving…" : isEdit ? "Update" : "Create"}
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
