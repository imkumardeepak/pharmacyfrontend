// path: frontend/src/components/auth/AuthGuard.tsx
// Redirects to /login if no valid JWT token is present.
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
