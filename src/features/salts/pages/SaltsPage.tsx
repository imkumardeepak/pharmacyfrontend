// path: frontend/src/features/salts/pages/SaltsPage.tsx
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSaltsQuery } from "../hooks/useSalts";
import { SaltsTable } from "../components/SaltsTable";
import { SaltFormDialog } from "../components/SaltFormDialog";
import type { Salt } from "../api/salts.api";

export function SaltsPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Salt | null>(null);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading, isError, error } = useSaltsQuery({
    q: debounced,
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
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight">Salt Master</h1>
        <span className="text-xs text-muted-foreground">
          {total.toLocaleString()} salts
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Input
            ref={searchRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name / strength  ( press / )"
            className="w-72"
          />
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + New{" "}
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
          <SaltsTable
            rows={data?.rows ?? []}
            onEdit={(salt) => {
              setEditing(salt);
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

      <SaltFormDialog
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
