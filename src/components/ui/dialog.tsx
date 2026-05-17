// path: frontend/src/components/ui/dialog.tsx
// Lightweight modal — keyboard-first (Esc to close handled by parent).
import { useEffect, type PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  className,
  children,
}: PropsWithChildren<DialogProps>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          "w-full max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-elevated animate-slide-in",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <kbd className="mr-1 rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
