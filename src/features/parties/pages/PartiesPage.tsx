// path: frontend/src/features/parties/pages/PartiesPage.tsx
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePartiesQuery } from "../hooks/useParties";
import { PartiesTable } from "../components/PartiesTable";
import { PartyFormDialog } from "../components/PartyFormDialog";
import { partyTypeEnum, type Party } from "../api/parties.api";

export function PartiesPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Party | null>(null);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading, isError, error } = usePartiesQuery({
    q: debounced,
    type: typeFilter || undefined,
    page,
    pageSize: 100,
  });

  useHotkeys("n", (e) => {
    e.preventDefault();
    setEditing(null);
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
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Party Master</h1>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {total.toLocaleString()} parties
          </span>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">All Types</option>
          {partyTypeEnum.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-3">
          <Input
            ref={searchRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name / phone / GST  (press /)"
            className="w-80"
          />
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + New{" "}
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
          <PartiesTable
            rows={data?.rows ?? []}
            onEdit={(p) => {
              setEditing(p);
              setOpen(true);
            }}
          />
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
      <PartyFormDialog
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
