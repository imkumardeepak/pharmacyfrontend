// path: frontend/src/features/invoices/pages/CashSalePage.tsx
// Cash Sale counter screen — line-item billing with auto MRP fetch.
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateCashSale } from "../hooks/useInvoices";
import type { CashSaleLineInput } from "../api/invoices.api";

const emptyLine: CashSaleLineInput = {
  itemId: "",
  batchId: "",
  qty: 1,
  freeQty: 0,
  unitPrice: "",
  discount: "0",
  tax: "0",
};

export function CashSalePage() {
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [patientName, setPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [salesmanId, setSalesmanId] = useState("");
  const [lines, setLines] = useState<CashSaleLineInput[]>([{ ...emptyLine }]);
  const [error, setError] = useState<string | null>(null);
  const create = useCreateCashSale();
  const busy = create.isPending;

  useHotkeys(
    "f2",
    (e) => {
      e.preventDefault();
      void submit();
    },
    { enableOnFormTags: true },
  );
  useHotkeys("escape", () => {
    navigate("/invoices");
  });

  function addLine() {
    setLines([...lines, { ...emptyLine }]);
  }
  function updateLine(idx: number, patch: Partial<CashSaleLineInput>) {
    setLines(lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }
  function removeLine(idx: number) {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== idx));
  }

  const totalAmount = lines.reduce(
    (sum, l) =>
      sum +
      (Number(l.unitPrice) || 0) *
        l.qty *
        (1 - (Number(l.discount) || 0) / 100),
    0,
  );

  async function submit() {
    setError(null);
    try {
      await create.mutateAsync({
        paymentMode,
        patientName: patientName || null,
        doctorId: doctorId || null,
        salesmanId: salesmanId || null,
        lines: lines.filter((l) => l.itemId && l.batchId),
      });
      navigate("/invoices");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit();
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight">
          Cash Sale Counter
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/invoices")}
          className="ml-auto"
        >
          ← Back to Invoices
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-hidden"
      >
        {/* Header fields */}
        <div className="flex gap-4 flex-wrap">
          <Field label="Payment Mode">
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Upi">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </Field>
          <Field label="Patient Name">
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-48"
            />
          </Field>
          <Field label="Doctor ID">
            <Input
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-40"
            />
          </Field>
          <Field label="Salesman ID">
            <Input
              value={salesmanId}
              onChange={(e) => setSalesmanId(e.target.value)}
              className="w-40"
            />
          </Field>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left">Item ID</th>
                <th className="px-2 py-2 text-left">Batch ID</th>
                <th className="px-2 py-2 text-right">Qty</th>
                <th className="px-2 py-2 text-right">Free</th>
                <th className="px-2 py-2 text-right">Price</th>
                <th className="px-2 py-2 text-right">Disc %</th>
                <th className="px-2 py-2 text-right">Tax %</th>
                <th className="px-2 py-2 text-right">Total</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-accent/40"
                >
                  <td className="px-2 py-1">
                    <Input
                      value={l.itemId}
                      onChange={(e) =>
                        updateLine(i, { itemId: e.target.value })
                      }
                      placeholder="Item ID"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      value={l.batchId}
                      onChange={(e) =>
                        updateLine(i, { batchId: e.target.value })
                      }
                      placeholder="Batch ID"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={l.qty}
                      onChange={(e) =>
                        updateLine(i, { qty: Number(e.target.value) || 0 })
                      }
                      className="h-8 w-20 text-xs tabular"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={l.freeQty}
                      onChange={(e) =>
                        updateLine(i, { freeQty: Number(e.target.value) || 0 })
                      }
                      className="h-8 w-16 text-xs tabular"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={l.unitPrice}
                      onChange={(e) =>
                        updateLine(i, { unitPrice: e.target.value })
                      }
                      className="h-8 w-24 text-xs tabular"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={l.discount}
                      onChange={(e) =>
                        updateLine(i, { discount: e.target.value })
                      }
                      className="h-8 w-20 text-xs tabular"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={l.tax}
                      onChange={(e) => updateLine(i, { tax: e.target.value })}
                      className="h-8 w-20 text-xs tabular"
                    />
                  </td>
                  <td className="px-2 py-1 text-right text-xs tabular font-medium">
                    {(
                      (Number(l.unitPrice) || 0) *
                      l.qty *
                      (1 - (Number(l.discount) || 0) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="px-2 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLine(i)}
                      disabled={lines.length <= 1}
                      className="text-[10px]"
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            + Add Line
          </Button>
          <span className="text-xs text-muted-foreground">
            {lines.length} line(s)
          </span>
          <span className="ml-auto text-base font-semibold tabular">
            ₹ {totalAmount.toFixed(2)}
          </span>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-[10px] text-muted-foreground">
            <kbd className="rounded border border-border px-1">F2</kbd> save ·{" "}
            <kbd className="rounded border border-border px-1">Esc</kbd> back
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/invoices")}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? "Saving…" : "Save Invoice"}
            </Button>
          </div>
        </div>
      </form>
    </div>
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
