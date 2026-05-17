// path: frontend/src/features/auth/pages/LoginPage.tsx
// Keyboard-first login page. Press Enter to submit.
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Lock, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { authApi, type LoginRequest } from "../api/auth.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await authApi.login(form);
      setAuth(
        res.token,
        {
          userId: "", // me() will fetch this on next load; we store what we have
          username: res.username,
          displayName: res.displayName,
          role: res.role,
        },
        res.expiresAt,
      );
      navigate("/items", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  function onFieldKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const fields = Array.from(
      e.currentTarget.form?.querySelectorAll("input") ?? [],
    );
    const idx = fields.indexOf(e.currentTarget);
    const next = fields[idx + 1];
    if (next) next.focus();
    else void submit();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submit();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(21,128,61,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(3,105,161,0.08)_0%,transparent_50%)]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-medium">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">
              PharmaERP
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  onKeyDown={onFieldKeyDown}
                  className="pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onKeyDown={onFieldKeyDown}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
                {error}
              </div>
            )}

            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign In"}
            </Button>

            <div className="rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
              <p className="mb-1 font-medium">Default Credentials:</p>
              <p>
                Username:{" "}
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">
                  admin
                </kbd>{" "}
                · Password:{" "}
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">
                  admin123
                </kbd>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 PharmaERP. Modern pharmaceutical management system.
        </p>
      </div>
    </div>
  );
}
