// path: frontend/src/features/parties/components/PartyFormDialog.tsx
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
import { useCreateParty, useUpdateParty } from "../hooks/useParties";
import { partyTypeEnum, type Party, type PartyInput } from "../api/parties.api";

interface Props {
  open: boolean;
  initial?: Party | null;
  onClose: () => void;
}
const empty: PartyInput = {
  name: "",
  type: "Customer",
  dlNumber: null,
  gstNumber: null,
  phone: null,
  address: null,
  creditLimit: "",
  baseDiscount: "",
};

export function PartyFormDialog({ open, initial, onClose }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<PartyInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const create = useCreateParty();
  const update = useUpdateParty();
  const busy = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      initial
        ? {
            name: initial.name,
            type: initial.type,
            dlNumber: initial.dlNumber,
            gstNumber: initial.gstNumber,
            phone: initial.phone,
            address: initial.address,
            creditLimit: initial.creditLimit,
            baseDiscount: initial.baseDiscount,
          }
        : empty,
    );
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [open, initial]);

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
      if (isEdit && initial)
        await update.mutateAsync({ id: initial.id, input: form });
      else await create.mutateAsync(form);
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
      title={isEdit ? `Edit Party — ${initial?.name}` : "New Party"}
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
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            onKeyDown={onFieldKeyDown}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {partyTypeEnum.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone ?? ""}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={15}
          />
        </Field>
        <Field label="GST Number">
          <Input
            value={form.gstNumber ?? ""}
            onChange={(e) =>
              setForm({ ...form, gstNumber: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={15}
          />
        </Field>
        <Field label="DL Number">
          <Input
            value={form.dlNumber ?? ""}
            onChange={(e) =>
              setForm({ ...form, dlNumber: e.target.value || null })
            }
            onKeyDown={onFieldKeyDown}
            maxLength={50}
          />
        </Field>
        <Field label="Credit Limit">
          <Input
            type="number"
            step="0.01"
            value={form.creditLimit}
            onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Base Discount %">
          <Input
            type="number"
            step="0.01"
            value={form.baseDiscount}
            onChange={(e) => setForm({ ...form, baseDiscount: e.target.value })}
            onKeyDown={onFieldKeyDown}
            required
            className="tabular"
          />
        </Field>
        <Field label="Address" childrenClassName="col-span-2">
          <Input
            value={form.address ?? ""}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value || null })
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
