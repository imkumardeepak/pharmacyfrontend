// path: frontend/src/features/companies/components/CompanyFormDialog.tsx
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
import { useCreateCompany, useUpdateCompany } from "../hooks/useCompanies";
import type { Company, CompanyInput } from "../api/companies.api";

interface Props {
  open: boolean;
  initial?: Company | null;
  onClose: () => void;
}
const empty: CompanyInput = { name: "", gstNumber: null, address: null };

export function CompanyFormDialog({ open, initial, onClose }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<CompanyInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const create = useCreateCompany();
  const update = useUpdateCompany();
  const busy = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      initial
        ? {
            name: initial.name,
            gstNumber: initial.gstNumber,
            address: initial.address,
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

  function onFieldKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const f = e.currentTarget.form;
    if (!f) return;
    const fields = Array.from(
      f.querySelectorAll<HTMLInputElement>("input,button[type=submit]"),
    );
    const idx = fields.indexOf(e.currentTarget);
    const next = fields[idx + 1];
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
      title={isEdit ? `Edit Company — ${initial?.name}` : "New Company"}
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
