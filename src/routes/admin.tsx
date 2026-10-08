import { createFileRoute } from "@tanstack/react-router";
import { Activity, BarChart3, Cell as CellIcon, FileText, Repeat, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppShell } from "@/components/nc/AppShell";
import { ChartCard, PageHeader, StatCard } from "@/components/nc/ui";
import { adminStats, dummyActivity } from "@/data/dummy";

void CellIcon;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — NotaChain" },
      { name: "description", content: "Statistik sistem NotaChain: nota, paspor, transfer, dan aktivitas." },
      { property: "og:title", content: "Admin — NotaChain" },
      { property: "og:description", content: "Statistik sistem NotaChain." },
    ],
  }),
  component: Admin,
});

const pieColors = ["var(--success)", "var(--info)", "var(--accent)", "var(--muted-foreground)"];
const typeLabel = { scan: "Scan", issue: "Terbit", transfer: "Transfer", verify: "Verifikasi", claim: "Klaim" } as const;

function Admin() {
  const n = (x: number) => x.toLocaleString("id-ID");
  return (
    <AppShell role="Admin" user="Admin Demo" items={[{ to: "/admin", label: "Ringkasan", icon: BarChart3, exact: true }]}>
      <PageHeader title="Dashboard Admin" desc="Statistik sistem (data dummy)." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total nota" value={n(adminStats.totalReceipts)} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Paspor diterbitkan" value={n(adminStats.passportsIssued)} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Transfer" value={n(adminStats.transfers)} icon={<Repeat className="h-4 w-4" />} />
        <StatCard label="Verifikasi publik" value={n(adminStats.verifications)} icon={<Activity className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Nota vs paspor per bulan" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={adminStats.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Legend />
                <Bar dataKey="nota" name="Nota" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paspor" name="Paspor" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Status garansi">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={adminStats.statusSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {adminStats.statusSplit.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <div className="p-5 font-semibold">Aktivitas terbaru</div>
        <Table>
          <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>Jenis</TableHead><TableHead>Aktor</TableHead><TableHead>Deskripsi</TableHead></TableRow></TableHeader>
          <TableBody>
            {dummyActivity.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap font-mono text-xs">{a.date}</TableCell>
                <TableCell><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{typeLabel[a.type]}</span></TableCell>
                <TableCell className="font-mono text-xs">{a.actor}</TableCell>
                <TableCell className="text-sm">{a.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
