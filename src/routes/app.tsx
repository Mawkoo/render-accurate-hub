import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ScanLine, ShieldCheck, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/nc/AppShell";
import { CURRENT_USER } from "@/data/dummy";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell
      role="Konsumen"
      user={CURRENT_USER.name}
      items={[
        { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { to: "/app/scan", label: "Scan Nota", icon: ScanLine },
        { to: "/app/warranties", label: "Daftar Garansi", icon: ShieldCheck },
        { to: "/verify", label: "Verifikasi Publik", icon: BadgeCheck },
      ]}
    >
      <Outlet />
    </AppShell>
  ),
});
