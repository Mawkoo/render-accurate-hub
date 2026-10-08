import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "@tanstack/react-router";
import { Copy, Inbox, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WarrantyPassport, WarrantyStatus } from "@/data/types";
import { daysLeft, effectiveStatus, fmtDate, remainingPercent, shortHash } from "@/lib/warranty";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
        <ShieldCheck className="h-4.5 w-4.5" />
      </span>
      NotaChain
    </span>
  );
}

const statusStyle: Record<WarrantyStatus | "Valid" | "Tidak Valid", string> = {
  Active: "bg-success/15 text-success border-success/30",
  Claimed: "bg-info/15 text-info border-info/30",
  Transferred: "bg-accent/25 text-accent-foreground border-accent/50",
  Expired: "bg-muted text-muted-foreground border-border",
  Valid: "bg-success text-success-foreground border-success",
  "Tidak Valid": "bg-destructive text-destructive-foreground border-destructive",
};

export function StatusBadge({ status }: { status: WarrantyStatus | "Valid" | "Tidak Valid" }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyle[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function StatCard({ label, value, icon, hint }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function WarrantyProgress({ passport }: { passport: WarrantyPassport }) {
  const pct = remainingPercent(passport);
  const d = daysLeft(passport.expiryDate);
  const tone = d < 0 ? "bg-muted-foreground" : d <= 7 ? "bg-destructive" : d <= 30 ? "bg-warning" : "bg-primary";
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{d >= 0 ? `${d} hari lagi` : "Masa garansi habis"}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

export function PassportCard({ passport }: { passport: WarrantyPassport }) {
  const status = effectiveStatus(passport);
  return (
    <Link
      to="/app/warranties/$id"
      params={{ id: passport.id }}
      className="group block rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-xs text-muted-foreground">{passport.code}</div>
          <div className="mt-1 truncate font-semibold">{passport.receipt.itemName}</div>
          <div className="truncate text-sm text-muted-foreground">{passport.receipt.storeName}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4">
        <WarrantyProgress passport={passport} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Berakhir {fmtDate(passport.expiryDate)}</span>
        <span className={passport.txHash ? "text-success" : ""}>{passport.txHash ? "● On-chain" : "○ Belum terbit"}</span>
      </div>
    </Link>
  );
}

export function QRBlock({ code }: { code: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/verify?code=${code}` : `/verify?code=${code}`;
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5">
      <div className="rounded-lg bg-card p-2">
        <QRCodeSVG value={url} size={148} />
      </div>
      <div className="font-mono text-sm font-semibold">{code}</div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(url);
          toast.success("Link verifikasi disalin");
        }}
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <Copy className="h-3.5 w-3.5" /> Salin link verifikasi
      </button>
    </div>
  );
}

export function ChartCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="mb-4 font-semibold">{title}</div>
      {children}
    </div>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-10 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" />
      <div className="mt-3 font-semibold">{title}</div>
      {desc && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function HashRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="break-all font-mono text-xs sm:text-right" title={value}>{value ? shortHash(value, 10) : "—"}</span>
    </div>
  );
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ children, tone = "warning" }: { children: ReactNode; tone?: "warning" | "info" }) {
  return (
    <div className={cn("rounded-lg border p-3 text-sm", tone === "warning" ? "border-warning/40 bg-warning/10" : "border-info/30 bg-info/10")}>
      {children}
    </div>
  );
}
