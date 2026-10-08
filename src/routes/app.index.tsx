import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ShieldCheck, Clock, Link2, ScanLine } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ChartCard, PageHeader, PassportCard, StatCard } from "@/components/nc/ui";
import { usePassports } from "@/lib/store";
import { daysLeft, effectiveStatus, fmtDate, reminderLevel } from "@/lib/warranty";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NotaChain" },
      { name: "description", content: "Ringkasan garansi, statistik, dan pengingat masa garansi." },
      { property: "og:title", content: "Dashboard — NotaChain" },
      { property: "og:description", content: "Ringkasan garansi dan pengingat masa garansi." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const passports = usePassports();
  const active = passports.filter((p) => effectiveStatus(p) === "Active");
  const reminders = passports.map((p) => ({ p, level: reminderLevel(p) })).filter((r) => r.level);
  const chart = active.map((p) => ({ name: p.receipt.itemName.split(" ").slice(0, 2).join(" "), hari: Math.max(0, daysLeft(p.expiryDate)) }));

  return (
    <>
      <PageHeader
        title="Halo, Raka 👋"
        desc="Ringkasan paspor garansimu hari ini."
        action={<Button asChild><Link to="/app/scan"><ScanLine /> Scan nota baru</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total paspor" value={passports.length} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Garansi aktif" value={active.length} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Terbit on-chain" value={passports.filter((p) => p.txHash).length} icon={<Link2 className="h-4 w-4" />} />
        <StatCard label="Pengingat" value={reminders.length} icon={<Bell className="h-4 w-4" />} hint="H-30 & H-7" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sisa masa garansi (hari)" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="hari" radius={[6, 6, 0, 0]}>
                  {chart.map((c, i) => (
                    <Cell key={i} fill={c.hari <= 7 ? "var(--destructive)" : c.hari <= 30 ? "var(--warning)" : "var(--primary)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Pengingat">
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada garansi yang akan habis dalam 30 hari.</p>
          ) : (
            <ul className="space-y-3">
              {reminders.map(({ p, level }) => (
                <li key={p.id}>
                  <Link to="/app/warranties/$id" params={{ id: p.id }} className={`block rounded-lg border p-3 ${level === "H-7" ? "border-destructive/40 bg-destructive/10" : "border-warning/40 bg-warning/10"}`}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{level}</span><span className="font-mono">{daysLeft(p.expiryDate)} hari</span>
                    </div>
                    <div className="mt-1 text-sm font-medium">{p.receipt.itemName}</div>
                    <div className="text-xs text-muted-foreground">Berakhir {fmtDate(p.expiryDate)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <h2 className="mb-3 mt-8 font-semibold">Garansi terbaru</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {passports.slice(0, 3).map((p) => <PassportCard key={p.id} passport={p} />)}
      </div>
    </>
  );
}
