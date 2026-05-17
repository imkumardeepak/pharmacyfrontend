// path: frontend/src/components/ui/input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all duration-200",
      "placeholder:text-muted-foreground/60",
      "hover:border-primary/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
