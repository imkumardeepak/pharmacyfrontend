// path: frontend/src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ItemsPage } from "@/features/items/pages/ItemsPage";
import { SaltsPage } from "@/features/salts/pages/SaltsPage";
import { CompaniesPage } from "@/features/companies/pages/CompaniesPage";
import { DoctorsPage } from "@/features/doctors/pages/DoctorsPage";
import { SalesmenPage } from "@/features/salesmen/pages/SalesmenPage";
import { PartiesPage } from "@/features/parties/pages/PartiesPage";
import { BatchesPage } from "@/features/batches/pages/BatchesPage";
import { InvoiceListPage } from "@/features/invoices/pages/InvoiceListPage";
import { CashSalePage } from "@/features/invoices/pages/CashSalePage";
import { PaymentsPage } from "@/features/payments/pages/PaymentsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/items" replace /> },
      { path: "items", element: <ItemsPage /> },
      { path: "salts", element: <SaltsPage /> },
      { path: "companies", element: <CompaniesPage /> },
      { path: "doctors", element: <DoctorsPage /> },
      { path: "salesmen", element: <SalesmenPage /> },
      { path: "parties", element: <PartiesPage /> },
      { path: "batches", element: <BatchesPage /> },
      { path: "invoices", element: <InvoiceListPage /> },
      { path: "invoices/cash-sale", element: <CashSalePage /> },
      { path: "payments", element: <PaymentsPage /> },
    ],
  },
]);
