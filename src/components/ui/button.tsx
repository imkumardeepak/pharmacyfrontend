// path: frontend/src/components/ui/button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-soft active:scale-[0.98]",
  outline:
    "border border-border bg-transparent hover:bg-accent hover:border-primary/50 active:scale-[0.98]",
  ghost: "hover:bg-accent/50 active:scale-[0.98]",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-soft active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-9 px-4 text-sm rounded-lg",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
